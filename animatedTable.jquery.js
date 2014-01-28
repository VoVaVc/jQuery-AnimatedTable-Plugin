(function( $ ) {
	var settings = {},
		wrapperClass = '',
		callback = null
		errorLog = null;
	var methods = {
		init : function(elem, options) {
			 settings = $.extend({
			 	'debug': true,
				'duration': 500,
				'wrapperClass': 'animatedTable',
				'tableClass': 'animatedTableMain',
				'cellAnimation': 'horizontal',
				'dragCell': true,
				'dragCellDelay': 150,
				'dragCellSnap': false,
				'dragCellCopy': false,
				'dragZindex': 999,
				// experimental 'dragCol': true,
				// experimental 'dragColDelay': 150,
				// experimental 'dragColCopy' : true,
				'exchangeFade': true,
				'exchangeFadeDuration': 500
			}, options)
			wrapperClass = settings.wrapperClass,
				elem = $(elem),
				transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
			if(!settings.debug){
		 		errorLog = function(){}
		 	}
		 	else{
		 		errorLog = function(text){$.error('animatedTable > '+text); return false;}
		 	}
			settings.duration /= 1000
			settings.exchangeFadeDuration /= 1000
			elem.addClass(settings.tableClass)
			if(elem.find('thead').length==0){
				elem.prepend('<thead style="display: none;"></thead>')
			}
			if(elem.find('tbody').length==0){
				elem.children().wrapAll('<tbody></tbody>')
			}
			elem.find('td').each(function(){
				if($(this).children().length>0){
					$(this).children().wrapAll('<div class="'+wrapperClass+'"></div>')
				}
				else{
					var text = $(this).text()
					$(this).empty().append('<div class="'+wrapperClass+'">'+text+'</div>')
				}
				$(this).find('.'+wrapperClass).css('max-height', $(this).outerHeight(true))
			})
			$('head').append('<style type="text/css" id="animatedTableStyles">.'+wrapperClass+' { overflow: hidden; white-space: nowrap;} .'+settings.tableClass+' td, .'+settings.tableClass+' th, .'+wrapperClass+', .'+wrapperClass+'_col { -webkit-transition: '+settings.duration+'s max-height, '+settings.duration+'s max-width, '+settings.duration+'s padding, '+settings.exchangeFadeDuration+'s opacity;-moz-transition: '+settings.duration+'s max-height, '+settings.duration+'s max-width, '+settings.duration+'s padding, '+settings.exchangeFadeDuration+'s opacity;-ms-transition: '+settings.duration+'s max-height, '+settings.duration+'s max-width, '+settings.duration+'s padding, '+settings.exchangeFadeDuration+'s opacity;-o-transition: '+settings.duration+'s max-height, '+settings.duration+'s max-width, '+settings.duration+'s padding, '+settings.exchangeFadeDuration+'s opacity;transition: '+settings.duration+'s max-height, '+settings.duration+'s max-width, '+settings.duration+'s padding, '+settings.exchangeFadeDuration+'s opacity; }</style>')
			if(settings.dragCell){
				$(elem).delegate('td', 'mousedown', function(evt){
					var dragCell = true,
						elemDrag = $(this),
						cellSnap = false;
					setTimeout(function(){
						if(dragCell){
							var startPointX = evt.pageX,
								startPointY = evt.pageY;
							$('body').css('user-select', 'none')
							elemDrag.css({
								'pointer-events': 'none',
								'position': 'relative',
								'z-index': settings.dragZindex
							})
							$(document).bind('mousemove', function(e){
								var moveX = (startPointX-e.pageX)*-1,
									moveY = (startPointY-e.pageY)*-1;
								elemDrag.css('transform', 'translate('+moveX+'px, '+moveY+'px)')
							})
							$(document).bind('mouseup', function(e){
								$('body').css('user-select', '')
								if(!settings.dragCellSnap || cellSnap){
									//swipe current element and e.target
									$(document).unbind('mousemove')
									$(document).unbind('mouseup')
									elemDrag.css({
										'transform': '',
										'pointer-events': ''
									})
									if($(e.target).closest('.'+settings.tableClass+' td').length>0){
										methods['exchangeCells'](elem, [null, $(e.target).closest('.'+settings.tableClass+' td'), elemDrag, settings.dragCellCopy])
									}
								}
								else if(!cellSnap){
									cellSnap=true
								}
							})
						}
					}, settings.dragCellDelay)
					$(this).bind('mouseup', function(){
						dragCell=false;
						$(this).unbind('mouseup')
					})
				})
			}
			//experimental function, will be availible in future releases
			//
			//if(settings.dragCol){
			//	$(elem).delegate('th', 'mousedown', function(evt){
			//		var dragCell = true,
			//			elemDrag = $(this),
			//			elemRelative = $(this).closest('.'+settings.tableClass).find('tbody td:nth-child('+(elemDrag.index()+1)+')')
			//		setTimeout(function(){
			//			if(dragCell){
			//				var startPointX = evt.pageX,
			//					startPointY = evt.pageY,
			//					prevX = 0;
			//				$('body').css('user-select', 'none')
			//				elemDrag.css('pointer-events', 'none')
			//				$(document).bind('mousemove', function(e){
			//					var moveX = (startPointX-e.pageX)*-1,
			//						moveY = (startPointY-e.pageY)*-1;
			//					if((elemDrag.position().left < $('.'+settings.tableClass).width() - elemDrag.width() - $('.'+settings.tableClass).position().left || prevX>moveX) && (elemDrag.position().left > $('.'+settings.tableClass).position().left || prevX<moveX)){
			//						elemDrag.css('transform', 'translateX('+moveX+'px)')
			//						elemRelative.css('transform', 'translateX('+moveX+'px)')
			//						prevX = moveX
			//					}
			//				})
			//				$(document).bind('mouseup', function(e){
			//					$('body').css('user-select', '')
			//					$(document).unbind('mousemove')
			//					$(document).unbind('mouseup')
			//					elemDrag.css({
			//						'transform': '',
			//						'pointer-events': ''
			//					})
			//					elemRelative.css('transform', '')
			//					var elemDragRelative = $(e.target).closest('.'+settings.tableClass).find('tbody td:nth-child('+($(e.target).closest('th').index()+1)+')');
			//					if($(e.target).closest('.'+settings.tableClass+' th').length>0){
			//						methods['exchangeCells'](elem, [null, elemDrag, $(e.target).closest('.'+settings.tableClass+' th'), false, true])
			//						for(var i=0, len=elemRelative.length; i<len; i++){
			//							methods['exchangeCells'](elem, [null, elemRelative[i], elemDragRelative[i], false, true])
			//						}
			//					}
			//				})
			//			}
			//		}, settings.dragColDelay)
			//		$(this).bind('mouseup', function(){
			//			dragCell=false;
			//			$(this).unbind('mouseup')
			//		})
			//	})
			//}
			settings.duration *= 1000
			settings.exchangeFadeDuration *= 1000
		},

		removeRow : function(elem, args){
			var identify = args[1];
			if(typeof identify == 'number' || !isNaN(identify)){
				var elemH = $($(elem).find('tbody tr').get(identify));
			}
			else{
				var elemH = $(identify);
				if($(identify).length==0){
					errorLog('removeRow > Element not exists')
					return false;
				}
			}
			var elemChild = elemH.find('td');
			elemChild.css({
				'padding-top': '0px',
				'padding-bottom': '0px'
			})
			elemH.find('.'+wrapperClass).css({
				'padding': '0px',
				'max-height': '0px'
			}).one(transitionEnd, function(){
				elemH.remove()
			})
		},

		addRow : function(elem, args){
			var row = args[1],
				index = args[2];
			if(typeof index == 'undefined' && index == null){
				errorLog('addRow > index is not defined')
				return false;
			}
			else if(typeof parseInt(index) !== 'number' && !isNaN(parseInt(index))){
				errorLog('addRow > index must be a number')
				return false;
			}
			if(index > elem.find('tr').length-1){
				index =  elem.find('tr').length-1
			}
			if(typeof row !== 'object' && !isNode(row)){
				row = $(row)
				if(row.length==0){
					errorLog('addRow > element provided by selector not exists')
					return false;
				}
			}
			else{
				if (typeof row.context != 'undefined'){
					row = row.clone()
				}
				else{
					var stringData = ''
					for(var i=0, len= row instanceof Array? row.length : Object.keys(row).length; i<len; i++){
						stringData+=row[i]
					}
					row = $(stringData)
				}
			}
			if(row[0].nodeName=='TD'){
				row = $('<tr></tr>').append(row)
			}
			else if(row[0].nodeName!='TR' && row[0].nodeName!='TH'){
				errorLog('addRow > your html provided element must contain <td> as wrapper')
			}
			var expected = elem.clone().addClass('size_metter_for_animatedTable'),
				expectedBody = expected.find('tbody').empty().append(row.clone()),
				appendHere = $(elem.find('tr').get(index));
			expected = expected.empty().append(expectedBody)
			$('body').append(expected)
			var height = $($('.size_metter_for_animatedTable')[0]).height()
			$($('.size_metter_for_animatedTable')[0]).remove()
			if(row.find('.'+wrapperClass).length==0){
				if(row.find('td').children().length>0){
					row.find('td').children().wrapAll('<div class="'+wrapperClass+'" style="max-height: 0px;"></div>')
				}
				else{
					row.find('td').each(function(){
						var text = $(this).text()
						$(this).empty().append('<div class="'+wrapperClass+'" style="max-height: 0px;">'+text+'</div>')
					})
				}
			}
			else{
				row.find('.'+wrapperClass).css('max-height', '0')
			}
			row.insertAfter(appendHere)
			setTimeout(function(){
				row.find('div.'+wrapperClass).css({
					'max-height': height+'px',
				})
				row.find('td').css({
					'padding': ''
				})
			}, 50)
		},

		removeCol: function(elem, args){
			var index = args[1],
				colHead = $(elem.find('thead tr').children().get(index)),
				colBody = elem.find('tbody tr').each(function(){
					return $(this).find('td').get(index)
				})
			if(typeof index == 'undefined' && index == null){
				errorLog('addRow > index is not defined')
				return false;
			}
			else if(typeof parseInt(index) !== 'number' && !isNaN(parseInt(index))){
				errorLog('addRow > index must be a number')
				return false;
			}
			if(colHead.children().length>0){
				colHead.children().wrapAll('<div class="'+wrapperClass+'" style="max-width: '+colHead.outerWidth(true)+';"></div>')
			}
			else{
				var text = colHead.text()
				colHead.empty().append('<div class="'+wrapperClass+'" style="max-width: '+colHead.outerWidth(true)+';">'+text+'</div>')
			}
			colBody.each(function(){
				var elemWrap = $($(this).children().get(index))
				if(elemWrap.children().length>0){
					elemWrap.children().wrapAll('<div class="'+wrapperClass+'_col" style="max-width: '+elemWrap.outerWidth(true)+';"></div>')
				}
				else{
					var text = elemWrap.text()
					elemWrap.empty().append('<div class="'+wrapperClass+'_col" style="max-width: '+elemWrap.outerWidth(true)+';">'+text+'</div>')
				}
			})
			colHead.css('padding', '0')
			colHead.find('.'+wrapperClass).css('max-width', '0').one(transitionEnd, function(){
				colBody.find('.'+wrapperClass+'_col').parent().remove()
				colHead.find('.'+wrapperClass).parent().remove()
			})
			colBody.find('.'+wrapperClass+'_col').css('max-width', '0') 
			colBody.find('.'+wrapperClass+'_col').parent().css('padding', '0')
		},

		addCol: function(elem, args){
			var name = args[1],
				index = args[2],
				textator = args[3],
				isBefore = args[4];
			if(typeof index == 'undefined' && index == null){
				errorLog('addCol > index is not defined')
				return false;
			}
			else if(typeof index !== 'number'){
				errorLog('addCol > index must be a number')
				return false;
			}
			if(typeof name !== 'object' && !isNode(name)){
				name = $(name)
				if(name.length==0){
					name = $('<th>'+args[1]+'</th>')
				}
				else if (typeof name.context != 'undefined'){
					name = name.clone()
				}
			}
			else{
				if(isNode(name)){
					name = $(name)
				}
				if (typeof name.context != 'undefined'){
					name = name.clone()
				}
			}
			if(name[0].nodeName=='TR'){
				name = name.children()
			}
			else if(name[0].nodeName!='TH'){
				name.wrap('<th></th>')
			}
			if(name.find('.'+wrapperClass).length==0){
				if(name.children().length>0){
					name.children().wrapAll('<div class="'+wrapperClass+'" style="max-width: 0px;"></div>')
				}
				else{
					var nameText = name.text()
					name.empty().append('<div class="'+wrapperClass+'" style="max-width: 0px;">'+nameText+'</div>')
				}
			}
			else{
				name.find('.'+wrapperClass).css({
					'max-width': '0',
					'max-height': ''
				})
			}
			var expected = elem.clone().addClass('size_metter_for_animatedTable_colAdd'),
				expectedBody = expected.find('thead tr:first').empty().append(name.clone().find('.'+wrapperClass).css('max-width', '').parent());
			expected = expected.empty().append(expectedBody)
			$('body').append(expected)
			var width = $($('.size_metter_for_animatedTable_colAdd th')[0]).width()
			$('.size_metter_for_animatedTable_colAdd').remove()
			name.css('padding', '0')
			name.find('.'+wrapperClass).css('max-width', 0)
			if(typeof textator === 'object'){
				textator = $.makeArray(textator)
			}
			if(typeof textator != 'undefined' && textator!=null){
				for(var i=0,len=textator.length; i<len; i++){
					if(typeof $(textator[i])[0] == 'undefined'){
						textator[i] = $('<td>'+textator[i]+'</td>')
					}
					else{
						if(typeof $(textator[i]).context != 'undefined'){
							textator[i] = $(textator[i]).clone()
						}
					}
					if(isBefore){
						methods['addCell'](elem, [null, i, index, $(textator[i])[0], true]);
					}
					else{
						methods['addCell'](elem, [null, i, index, $(textator[i])[0]]);
					}
				}
			}
			else{
				for(var i=0,len=textator.length; i<len; i++){
					if(isBefore){
						methods['addCell'](elem, [null, i, index, '', true]);
					}
					else{
						methods['addCell'](elem, [null, i, index, '']);
					}
				}
			}
			var colHead = $(elem.find('thead tr').children().get(index));
			if(isBefore){
				name.insertBefore(colHead)
			}
			else{
				name.insertAfter(colHead)
			}
			setTimeout(function(){
				name.find('.'+wrapperClass).css({
					'max-width': width,
					'margin': '0 auto'
				})
				name.css({
					'padding': ''
				})
			}, 50)
		},

		addCell: function(elem, args){
			var trIndex = args[1],
				tdIndex = args[2],
				text = args[3],
				isBefore = args[4];
			if(settings.cellAnimation == 'horizontal'){
				var direct = 'max-width';
				var undirect = 'max-height';
			}
			else if(settings.cellAnimation == 'vertical'){
				var direct = 'max-height';
				var undirect = 'max-width';
			}
			if(typeof parseInt(trIndex) !== 'number' && !isNaN(parseInt(trIndex))){
				errorLog('addRow > trIndex must be a number')
				return false;
			}
			if(typeof parseInt(tdIndex) !== 'number' && !isNaN(parseInt(tdIndex))){
				errorLog('addRow > tdIndex must be a number')
				return false;
			}
			if(typeof text !== 'object' && !isNode(text)){
				text = $(text)
				if(text.length==0){
					text = $('<td>'+args[3]+'</td>')
				}
				else if (typeof text.context != 'undefined'){
					text = text.clone()
				}
			}
			else{
				if (typeof text.context != 'undefined'){
					text = text.clone()
				}
				else if(isNode(text)){
					text = $(text)
				}
				else{
					var stringData = ''
					for(var i=0, len= text instanceof Array? text.length : Object.keys(text).length; i<len; i++){
						stringData+=text[i]
					}
					text = $(stringData)
				}
			}
			if(text[0].nodeName=='TR'){
				text = text.children()
			}
			else if(text[0].nodeName!='TD' && text[0].nodeName!='TH'){
				text = $('<td></td>').append(text)
			}
			if(text.find('.'+wrapperClass).length==0){
				if(text.children().length>0){
					text.children().wrapAll('<div class="'+wrapperClass+'" style="'+direct+': 0px;"></div>')
				}
				else{
					text.each(function(){
						var textate = $(this).text();
						$(this).empty().append('<div class="'+wrapperClass+'" style="'+direct+': 0px;">'+textate+'</div>')
					})
				}
			}
			else{
				text.find('.'+wrapperClass).attr('style', direct+': 0px;')
			}
			var whereTo = $($(elem.find('tbody tr').get(trIndex)).find('td').get(tdIndex)),
				expected = elem.clone().addClass('size_metter_for_animatedTable_cell'),
				expectedTr = expected.find('tbody tr:nth-child('+(parseInt(trIndex)+1)+')')
				expectedTd = expectedTr.find('td:nth-child('+(parseInt(tdIndex)+1)+')').replaceWith(text.clone().find('.'+wrapperClass).css({
					'max-width': '',
					'max-height': ''
				}).parent())
				expectedBody = expected.find('tbody').empty().append(expectedTr.append(expectedTd));
				expected = expected.empty().append(expectedBody)
				$('body').append(expected)
				var directProp = direct == 'max-height' ? $($('.size_metter_for_animatedTable_cell td')[0]).height() : $($('.size_metter_for_animatedTable_cell td')[0]).width()
			$($('.size_metter_for_animatedTable_cell')[0]).remove()
			text.css('padding', 0)
			if(typeof isBefore != 'undefined' && isBefore){
				text.insertBefore(whereTo)
			}
			else{
				text.insertAfter(whereTo)
			}
			setTimeout(function(){
				text.find('.'+wrapperClass).css(direct, directProp+'px')
				text.css({
					'padding': ''
				})
			}, 50)
		},

		removeCell: function(elem, args){
			var trIndex = args[1],
				tdIndex = args[2];
			if(settings.cellAnimation == 'horizontal'){
				var direct = 'max-height';
			}
			else if(settings.cellAnimation == 'vertical'){
				var direct = 'max-width';
			}
			if(args.length>2){
				if(typeof trIndex == 'number' || !isNaN(trIndex)){
					if(typeof tdIndex == 'number' || !isNaN(tdIndex)){
						var elemH = $(elem).find('tbody tr:nth-child('+(parseInt(trIndex)+1)+') td:nth-child('+(parseInt(tdIndex)+1)+')');
					} 
					else{
						errorLog('removeCell > td index is not valid')
						return false;
					}
				}
				else{
					errorLog('removeCell > tr index is not valid')
					return false;
				}
			}
			else{
				var elemH = $(trIndex);
				if($(trIndex).length==0){
					errorLog('removeCell > Element provided by selector not exists')
					return false;
				}
			}
			var elemXC = elemH.find('.'+wrapperClass)
			elemH.css('padding', 0).one(transitionEnd, function(){
						elemXC.css('max-height', 0)
					})
			elemXC.css('max-width', elemXC.width())
			setTimeout(function(){
				elemXC.css({
					'opacity': 0,
				}).one(transitionEnd, function(){
					elemXC.css('max-width', 0).one(transitionEnd, function(){
						setTimeout(function(){
							elemH.remove()
						}, 100)
					})
				})
			}, 50)
		},

		exchangeCells: function(elem, args){
			var cell1 = args[1],
				cell2 = args[2],
				clone = args[3];
				preventFade = args[4];
			if(typeof cell1 !== 'object' && !isNode(cell1)){
				cell1 = $(cell1)
				if(cell1.length==0){
					errorLog('addCell > element provided by selector not exists')
					return false;
				}
			}
			else{
				if(isNode(cell1)){
					cell1 = $(cell1)
				}
			}
			if(typeof cell2 !== 'object' && !isNode(cell2)){
				cell2 = $(cell2)
				if(cell2.length==0){
					errorLog('addCell > element provided by selector not exists')
					return false;
				}
			}
			else{
				if(isNode(cell2)){
					cell2 = $(cell2)
				}
			}
			if(cell1[0].nodeName=='TR' || cell2[0].nodeName=='TR'){
				errorLog('addCell > provide a cell, not a row')
			}
			if(cell1[0].nodeName=='TD' || cell1[0].nodeName=='TH'){
				if(cell1.children().length>0){
					cell1 = cell1.children()
				}
				else{
					var parent1 = cell1
					cell1 = cell1.text()
				}
			}
			if(cell2[0].nodeName=='TD' || cell2[0].nodeName=='TH'){
				if(cell2.children().length>0){
					cell2 = cell2.children()
				}
				else{
					var parent2 = cell2
					cell2 = cell2.text()
				}
			}
			parent1 = typeof parent1 != 'undefined' && parent1!= null ? parent1 : cell1.parent(),
			parent2 = typeof parent2 != 'undefined' && parent2!= null ? parent2 : cell2.parent(),
			parent1W = parent1.css('max-width', '').outerWidth(true),
			parent2W = parent2.css('max-width', '').outerWidth(true);
			if(clone){
				cell1 = typeof cell1 == 'object' ? cell2.clone() : cell2
			}
			if(settings.exchangeFade && !preventFade){
				parent2.css({
					'opacity': '0',
					'transition-duration': '0',
					'max-width': '0'
				})
				parent1.css({
					'opacity': '0',
					'max-width': '0'
				}).one(transitionEnd, function(){
					parent2.empty().append(cell1)
					parent2.css({
						'transition-duration': '',
						'opacity': '',
						'max-width': parent1W
					}).one(transitionEnd, function(){
						parent1.empty().append(cell2)
						parent1.css({
							'opacity': '',
							'max-width': parent2W
						})
					})
				})
			}
			else{
				parent1.empty().append(cell2)
				parent2.empty().append(cell1)
			}
		},

		option: function(elem, args){
			var opinion =  args[1],
				newVal = args[2],
				errOpt = opinion in settings,
				changed = [];
			if(typeof newVal != 'undefined' && newVal != null){
				var rewrite = true;
				if(!errOpt){
					errorLog('option > incorrect option name')
					return false;
				}
			}
			if(typeof opinion == 'string'){
				if(rewrite){
					settings[opinion] = newVal
					changed.push(opinion)
				}
				else{
					callback = settings[opinion]
				}
			}
			else if(typeof opinion == 'object'){
				for(var i in opinion){
					if(i in settings){
						settings[i] = opinion[i]
						changed.push(i)
					}
					else{
						errorLog('option > incorrect option name '+i)
						return false;
					}
				}
			}
			if(!settings.debug){
		 		errorLog = function(){}
		 	}
		 	else{
		 		errorLog = function(text){$.error('animatedTable > '+text);}
		 	}
		 	//if('wrapperClass' in changed || 'tableClass' in changed || exchangeFadeDuration 'tableClass' in changed || duration 'tableClass' in changed){
		 	//	$('head#animatedTableStyles').empty().append('.'+wrapperClass+' { overflow: hidden; white-space: nowrap;} .'+settings.tableClass+' td, .'+settings.tableClass+' th, .'+wrapperClass+', .'+wrapperClass+'_col { -webkit-transition: '+settings.duration+'s max-height, '+settings.duration+'s max-width, '+settings.duration+'s padding, '+settings.exchangeFadeDuration+'s opacity;}')
		 	//}
		},

		destroy: function(elem){
			elem.find('div.'+wrapperClass).each(function(){
				if($(this).children().length>0){
					var pre = $(this).children()
				}
				else{
					var pre = $(this).text()
				}
				$(this).replaceWith(pre)
			})
			elem.undelegate('td', 'mousedown')
			elem.removeClass(settings.tableClass)
		}
  	};

  	function isNode(o){
	  return (
	    typeof Node === "object" ? o instanceof Node : 
	    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
	  );
	}

  $.fn.animatedTable = function(method) {
	 var oldOptions = arguments,
	 	elem = this;
	 callback = null
  	 this.each(function() {
  	 	if(this.nodeName=='TABLE'){
	  		if (methods[method]){
				return methods[method](elem, oldOptions);
			} else if ( typeof method === 'object' || ! method ) {
				return methods['init'](elem, oldOptions[0]);
			} else {
				errorLog('No such method ' +  method + ' for animatedTable plugin');
			} 
		}
		else{
			$.error('animatedTable > provided element must be a table'); 
			return false;
		}
  	 })
  	 if(callback!=null){
  	 	return callback
  	 }
  };
})(jQuery);
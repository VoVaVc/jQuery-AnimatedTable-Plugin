document.oncontextmenu = function() {return false};
var pagedex = 'cols';
$(document).ready(function(){
	$('code').each(function(i, e) {hljs.highlightBlock(e, null, true)});
	$('label').on('click', function(){
		$(this).parent().find('input[type=radio][name='+$(this).find('input').attr('name')+']')
	})
	$('form').submit(function(){
		return false;
	})
	$('.'+pagedex+' table').animatedTable()
	$('div.listing li').click(function(){
		$(this).toggleClass('active')
	})
	$('table').on('mouseup', function(e){
		if(pagedex=='cols'){
			if(e.which==3){
				$('.'+pagedex+' table').animatedTable('removeCol', $(e.target).closest('td').index())
			}
			else{
				var idx = $(e.target).closest('td').index();
				if($('tbody td:nth-child('+(idx+1)+')').length>0){
					$('.'+pagedex+' table').animatedTable('addCol', $(e.target).closest('table').find('thead th').get(idx), idx, $(e.target).closest('table').find('tbody td:nth-child('+(idx+1)+')'))
				}
			}
		}
		else if(pagedex=='rows'){
			if(e.which==3){
				$('.'+pagedex+' table').animatedTable('removeRow', $(e.target).closest('tr'))
			}
			else{
				$('.'+pagedex+' table').animatedTable('addRow', $(e.target).closest('tr'), $(e.target).closest('tr').index()+1)
			}
		}
		else if(pagedex=='cells'){
			if(e.which==3){
				$('.'+pagedex+' table').animatedTable('removeCell', $(e.target).closest('td'))
			}
			else{
				$('.'+pagedex+' table').animatedTable('addCell', $(e.target).closest('tr').index(), $(e.target).closest('td').index(), $(e.target).closest('td'))
			}
		}
	})
	$('[data-page]').on('click', function(){
		pagedex = $(this).attr('data-page');
		$('section.show').removeClass('show')
		$('section.'+pagedex).addClass('show')
		$('.'+pagedex+' table').animatedTable('destroy')
		if(pagedex == 'drag'){
			$('.'+pagedex+' table').animatedTable({
				'dragCell': true
			})
		}
		else{
			$('.'+pagedex+' table').animatedTable()
		}
	})

	$('#rowRemoveSelector, #rowRemoveIndexTr, #rowRemoveIndexTd').change(function(){
		if($('#rowRemoveSelector').val()!=''){
			$('#rowRemoveIndexTr, #rowRemoveIndexTd').attr('disabled', 'disabled')
		}
		else{
			$('#rowRemoveIndexTr, #rowRemoveIndexTd').removeAttr('disabled')
		}
		if($('#rowRemoveIndexTr').val()!='' || $('#rowRemoveIndexTd').val()!=''){
			$('#rowRemoveSelector').attr('disabled', 'disabled')
		}
		else{
			$('#rowRemoveSelector').removeAttr('disabled')
		}
	})
	
	$('button.addRow').click(function(){
		var data=[];
		$('.rowAddContext input').each(function(i){
			data[i]='<td>'+$(this).val()+'</td>'
		});
		$('section.rows table').animatedTable('addRow', data, $('#rowAddIndex').val())
	})
	
	$('button.removeRow').click(function(){
		$('section.rows table').animatedTable('removeRow', $('#rowRemoveIndex').val())
	})

	$('button.removeCell').click(function(){
		if($('#rowRemoveIndexTr').val()!='' || $('#rowRemoveIndexTd').val()!=''){
			$('section.cells table').animatedTable('removeCell', $('#rowRemoveIndexTr').val(), $('#rowRemoveIndexTd').val())
		}
		else{
			$('section.cells table').animatedTable('removeCell', $('#rowRemoveSelector').val())
		}
	})

	$('button.addCell').click(function(){
		$('section.cells table').animatedTable('addCell', $('#cellTRIndex').val(), $('#cellTDIndex').val(), $('#cellTextAdd').val())
	})

	$('button.addCol').click(function(){
		var data=[];
		$('.colAddContext input').each(function(i){
			data[i]='<td>'+$(this).val()+'</td>'
		});
		$('.cols table').animatedTable('addCol', $('#colAddHead').val(), parseInt($('#colAddIndex').val()), data)
	})

	$('button.removeCol').click(function(){
		$('.cols table').animatedTable('removeCol', $('#colRemoveIndex').val())
	})

	$('input[name=row_type]').change(function(){
		$(this).parents('form').find('.'+$(this).attr('data-segment')).addClass('show').siblings().removeClass('show')
	})

	$('button.dragCell').click(function(){
		$('.drag table').animatedTable('destroy')
		$('.drag table').animatedTable({
			'dragCell': true,
			'dragZindex': $('#dragZindex').val(),
			'dragCellDelay': $('#dragDelay').val(),
			'dragCellSnap': $('#dragSnap')[0].checked,
			'dragCellCopy': $('#dragCopy')[0].checked
		})
	})
	$('button.exchangeBtn').click(function(){
		$('section.cells table').animatedTable('exchangeCells', 'section.show table '+$('#exchangeCell1').val(), 'section.show table '+$('#exchangeCell2').val(), $('#exchangeCopy')[0].checked, $('#exchangeFade')[0].checked)
	})
})
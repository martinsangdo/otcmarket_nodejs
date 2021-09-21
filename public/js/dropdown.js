//author: Martin
/**
* Add new row UI
*/

//
function addOption(){
  var $tbl_container = $('#tbl_container');
  var $tr = $('#tr_tmpl').clone(false);
   $tbl_container.append($tr.removeClass('hide').removeAttr('id'));
}

//remove a line from UI
//todo: no need to confirm?
function removeLine(opt){
  $(opt).closest('.normal_tr').remove();
}
//show messages
function showMess(str){
  if (str){
    $('#mess').text(str);
  }
}
//get values from UI
function getValues(){
  var values = [];
  var $tbl_container = $('#tbl_container');
  var $tr = $('.normal_tr', $tbl_container);
  var name, value;
  for (var i=0; i<$tr.length; i++){
    name = $.trim($('.name', $tr[i]).val());
    value = $.trim($('.symbol', $tr[i]).val());
    if (!isEmpty(name) && !isEmpty(value)){
      values.push({
        label: name,
        value: value
      });
    }
  }
  return values;
}
//save all data to DB
//skip missing input lines
function save(){
  if (submitting){
    return;
  }
  //collect data
  var values = getValues();
  console.log(values);
  if (values.length ==0){
    showMess('Empty values');
    return;
  }
  //
  submitting = true;
  showMess('Processing...');
  ajaxPost('save', {values: JSON.stringify(values)}, function(resp){
    resp = $.parseJSON(resp);
    if (resp.result == 'OK'){
      showMess('Data is saved');
    } else {
      showMess('Something is wrong!');
    }
    submitting = false;
  });
}

//export to CSV file
function exportCSV(){
  var values = getValues();
  if (values.length == 0){
    showMess('Empty values');
    return;
  }
  var writeContent = 'Label, Value\n';
  for (var i=0; i<values.length; i++){
    writeContent += values[i]['label']+', '+values[i]['value']+'\n';
  }
  window.open('data:application/csv,' + writeContent);
}

function UnBlockUsers(e) {
  var currentForm = FormApp.getActiveForm();
  var responses = currentForm.getResponses();
  if (!responses.length) {
      return;
   }
  var currentUser = responses[responses.length - 1].getRespondentEmail();

  // Open a form by ID and log the responses to each question.
  var formLinkSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16kpJ1T4d1witgBvShIt6LD9VWbkQLkaYRMgQfH8reIQ/edit#gid=0');
  var activeSheet = formLinkSheet.getSheetByName('Sheet1');
  var column = activeSheet.getRange('A:C');
  var formIds = column.getValues();
  var index=0;
  var responseRemaining = false;
  while(formIds[index][0].length) {
    var form = FormApp.openById(formIds[index][1]);
    if (form == currentForm || !formIds[index][2] || new Date(formIds[index][2]) > new Date()) {
      index++;
      continue;
    }
    var responseFound = false;
    var formResponses = form.getResponses();
    for (var i = 0; i < formResponses.length; i++) {
      var formResponse = formResponses[i];
      if (formResponse.getRespondentEmail() == currentUser) {
        responseFound = true;
        continue;
      }
    }
    if (!responseFound) {
      responseRemaining = true;
      break;
    }
    index++;
  }

  if (responseRemaining) {
    var response = UrlFetchApp.fetch('http://638165c8.ngrok.io/block-user/?usernames=' + currentUser);
    Logger.log(response);
//    MailApp.sendEmail('shivam.jindal@joshtechnologygroup.com', 'new response', currentUser + ' remainaing');
  } else {
    var response = UrlFetchApp.fetch('http://638165c8.ngrok.io/unblock-user/?usernames=' + currentUser);
    Logger.log(response);
//    MailApp.sendEmail('shivam.jindal@joshtechnologygroup.com', 'new response', currentUser + ' not remainaing');
  }
}

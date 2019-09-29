function dailyCronForBlocker() {
  var blocked_usernames = [], unblocked_usernames=[];
  // Open a form by ID and log the responses to each question.
  var formLinkSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16kpJ1T4d1witgBvShIt6LD9VWbkQLkaYRMgQfH8reIQ/edit#gid=0');
  var activeSheet = formLinkSheet.getSheetByName('Sheet1');
  var column = activeSheet.getRange('A:C');
  var formIds = column.getValues();
  var index=0, userEmailIndex=0;

  var UserSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16kpJ1T4d1witgBvShIt6LD9VWbkQLkaYRMgQfH8reIQ/edit#gid=0');
  var userSubsheet = formLinkSheet.getSheetByName('Sheet2');
  var userEmails = userSubsheet.getRange('A:A').getValues();

  while(userEmails[userEmailIndex][0].length) {
    var currentUser = userEmails[userEmailIndex][0];
    var responseRemaining = false;
    var pendingForms = [];
    index=0;
    while(formIds[index][0].length && currentUser) {
      var form = FormApp.openById(formIds[index][1]);
      if (!formIds[index][2] || (new Date(formIds[index][2])) > new Date()) {
        index++;
        continue;
      } else {
        var responseFound = false;
        var formResponses = form.getResponses();
        for (var i = 0; i < formResponses.length; i++) {
          var formResponse = formResponses[i];
          if (formResponse.getRespondentEmail() == currentUser) {
            responseFound = true;
            break;
          }
        }
        if (!responseFound) {
          responseRemaining = true;
          pendingForms.push(form.getPublishedUrl());
        }
      }
      index++;
    }

    if (responseRemaining) {
//      MailApp.sendEmail('shivam.jindal@joshtechnologygroup.com', 'Need Response Urgently', currentUser + ' remainaing');
      MailApp.sendEmail(currentUser, 'Need Response Urgently', 'Please fill these forms urgently, You internet access will be blocked untill we receive your response.\n' + pendingForms.join('\n'));
      blocked_usernames.push(currentUser);
    } else {
      unblocked_usernames.push(currentUser);
//      MailApp.sendEmail('shivam.jindal@joshtechnologygroup.com', 'new response', currentUser + ' not remainaing');
    }
    userEmailIndex++;
  }

  if (blocked_usernames.length) {
    var response = UrlFetchApp.fetch('http://638165c8.ngrok.io/block-user/?usernames=' + blocked_usernames.join(','));
    Logger.log(response);
  }
  if (unblocked_usernames.length) {
    var response = UrlFetchApp.fetch('http://638165c8.ngrok.io/unblock-user/?usernames=' + unblocked_usernames.join(','));
    Logger.log(response);
  }

}
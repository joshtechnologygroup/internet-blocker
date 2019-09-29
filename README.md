# internet-blocker

- Steps To setup
- - Clone Repo ```git clone git@github.com:joshtechnologygroup/internet-blocker.git```
- - Install requirements ```pip install -r requirements.txt```
- - Run Django Server ```python manage.py runserver```
- - Use ng-rok to make api endpoints available globally https://ngrok.com/
- - Update ng-rok endpoints in google scripts after ng-rok setup

- Google Script for cron to block users who has any pending form
https://script.google.com/a/joshtechnologygroup.com/d/1bEHyO_16ffRSVLb4hhKixBA9jN6AKTI8Qgi28kR10ZU8WgFqw46wzuGD/edit?usp=sharing

- Google sheet for usernames and forms https://docs.google.com/spreadsheets/d/16kpJ1T4d1witgBvShIt6LD9VWbkQLkaYRMgQfH8reIQ/edit#gid=0

- Google Script for trigger on formSubmit: use "unblock-users.gs"

- Run this script to create trigger

```var form = FormApp.getActiveForm();
ScriptApp.newTrigger('UnBlockUsers').forForm(form).onFormSubmit().create();```


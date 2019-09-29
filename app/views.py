# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse

from app.utils import add_username, remove_username


def block_username_view(request):
    usernames = request.GET.get('usernames', '')
    usernames = usernames.split(',')
    if usernames:
        add_username(map(lambda username: username[:username.index('@')], usernames))
    return HttpResponse('done')


def unblock_username_view(request):
    usernames = request.GET.get('usernames', '')
    usernames = usernames.split(',')
    if usernames:
        remove_username(map(lambda username: username[:username.index('@')], usernames))
    return HttpResponse('done')

import requests
import xml.etree.ElementTree as ET

from django.conf import settings
from django.contrib.auth.models import User


def set_usernames(usernames):
    print(usernames)
    payload = '<Request><Login><Username>{username}</Username><Password>{password}</Password></Login><Set operation="update"><WebFilterPolicy><Name>Block for Hackthon Test</Name><Description>Block some defined url of our user</Description><DefaultAction>Allow</DefaultAction><DownloadFileSizeRestriction>300</DownloadFileSizeRestriction><RuleList><Rule><CategoryList><Category><ID>facebook</ID><type>URLGroup</type></Category></CategoryList><HTTPAction>Deny</HTTPAction><HTTPSAction>Deny</HTTPSAction><FollowHTTPAction>1</FollowHTTPAction><Schedule>All The Time</Schedule><PolicyRuleEnabled>1</PolicyRuleEnabled><CCLRuleEnabled>1</CCLRuleEnabled><UserList>{users}</UserList></Rule></RuleList></WebFilterPolicy></Set></Request>'
    payload = payload.format(users=''.join(map(lambda x: '<User>' + x + '</User>', usernames)), username=settings.SOPHOS_USERNAME, password=settings.SOPHOS_PASSWORD)
    r = requests.get(
        'https://192.168.0.1:9443/webconsole/APIController',
        {'reqxml': payload}, verify=False
    )
    return r.content


def get_usernames():

    return User.objects.filter(username__contains='.').values_list('username', flat=True)

    response = requests.get(
        'https://192.168.0.1:9443/webconsole/APIController',
        {'reqxml': '<Request><Login><Username>{username}</Username><Password>{password}</Password></Login><get><WebFilterPolicy></WebFilterPolicy></get></Request>'.format(username=settings.SOPHOS_USERNAME, password=settings.SOPHOS_PASSWORD)},
        verify=False
    )
    f = open('usernames.xml', 'wb')
    f.write(response.content)
    f.close()
    xmlfile = open('usernames.xml')
    tree = ET.parse(xmlfile)
    root = tree.getroot()
    for item in root.findall('WebFilterPolicy'):
        if item.find('Name').text == 'Block for Hackthon Test':
            for username in map(lambda x: x.text, item.findall('RuleList/Rule/UserList/User')):
                User.objects.get_or_create(username=username)


def add_username(new_usernames):
    usernames = set(get_usernames())
    new_usernames = usernames.union(set(new_usernames))
    if usernames == new_usernames:
        return ''
    for username in new_usernames:
        User.objects.get_or_create(username=username)
    print(new_usernames)
    return set_usernames(new_usernames)


def remove_username(usernames_to_removed):
    usernames = set(get_usernames())
    new_usernames = usernames - set(usernames_to_removed)
    if usernames == new_usernames:
        return ''
    User.objects.exclude(username__in=new_usernames).exclude(is_staff=True).delete()
    return set_usernames(new_usernames)

# -*- coding: utf-8 -*-
"""
Created on Tue Feb 02 02:02:30 2016

@author: yiyuezhuo
"""

import markdown
import sys
import os

head='''
<!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <title>blog</title>
  <link type="text/css" rel="stylesheet" href="../static/test.css">
  </head>
  <body>
'''
foot='''
</body>
</html>
'''

def sos(s):
    return head+markdown.markdown(s)+foot
def trans(path,out_path):
    f=open(path)
    s=f.read()
    f.close()
    f=open(out_path,'w')
    f.write(sos(s.decode('utf8')).encode('utf8'))
    f.close()
def replace(name,fix='.txt'):
    if '.' in name:
        name=name.split('.')[0]
    trans(name+fix,name+'.html')
    os.remove(name+fix)
def replaceAll():
    name_l=[name for name in os.listdir('.') if '.' in name and name.split('.')[-1]=='md']
    for name in name_l:
        print name+' -> '+name.split('.')[0]+'.html'
        replace(name,fix='.md')
    

if len(sys.argv)==1:
    replaceAll()
elif len(sys.argv)==2:
    replace(sys.argv[1])
elif len(sys.argv==3):
    name,p1,p2=sys.argv
    trans(p1,p2)
else:
    print 'input error'
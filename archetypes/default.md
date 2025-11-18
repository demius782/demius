---
title: "{{ replace .Name "-" " " | title }}"
draft: false
slug: "{{ substr (md5 (now.Unix)) 0 3 }}{{ now.Unix }}"
date: {{ .Date }}
categories: []
tags: []
---
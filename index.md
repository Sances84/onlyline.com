---
layout: post
title: "Index Page - OnlyLine.com"
---
<div style="text-align: center;">
    <img src="https://sances84.github.io/onlyline.com/assets/logo.png" alt="Logo" style="width: 300px; height: auto;">
</div>
<p align="center"><b>OnlyLine</b>.com</p>
Hello, i'm Ilya Ovcharenko, i creator of uncommercial project.<br>
My birthday is will be come:<br>
My 12th birthday - 2026 15 july<br>
my 13th birthday - 2027 15 july<br>
my 14th birthday - 2028 15 july<br>
And more will be come...<br>

====================
News Pages will be here:
{% for post in site.posts %}
  <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
  <p>{{ post.date | date: "%B %e, %Y" }} — {{ post.excerpt }}</p>
{% endfor %}
====================

[My scratch account](https://scratch.mit.edu/users/sances84){:target="_blank"}<br>
[My itch.io account](https://ilya14.itch.io){:target="_blank"}<br><br>
Please note:You are can download and use, and mess around with my website source code [here!](https://github.com/Sances84/onlyline.com){:target="_blank"}<br>

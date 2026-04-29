---
title: "Index Page | OnlyLine"
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
And more will be come...<br><br>

[My projects that i made](https://sances84.github.io/onlyline.com/my-projects/)

====================<br>
Newer News Pages will be here<br>
Please note that loads 3 newer posts only.:<br>
{% for post in site.posts limit: 3 %}
<details>
  <summary>{{ post.title }} - {{ post.date | date: "%B %e, %Y" }}</summary>
  {{ post.content }}
</details>
{% endfor %}
====================<br>

{% if site.posts.size > 3 %}
====================<br>
Older Posts can be found here including full newer pages:<br>
{% for post in site.posts %}
<details>
  <summary>{{ post.title }} - {{ post.date | date: "%B %e, %Y" }}</summary>
  {{ post.content }}
</details>
{% endfor %}
====================<br>
{% endif %}

[My scratch account](https://scratch.mit.edu/users/sances84){:target="_blank"}<br>
[My friend, Erbolatov Aldyar's scratch account](https://scratch.mit.edu/users/Aldiyar103){:target="_blank"}<br>
[My itch.io account](https://ilya14.itch.io){:target="_blank"}<br>
[My penguinmod.com account](https://penguinmod.com/profile/?user=sances84){:target="_blank"}<br><br>
Please note:You are can download and use, and mess around with my website source code [here!](https://github.com/Sances84/onlyline.com){:target="_blank"}<br>

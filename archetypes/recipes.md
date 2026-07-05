---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
image: hero.jpg
---

{{< ingredients component="Main" >}}
- Example ingredient, prepared
{{< /ingredients >}}

{{< ingredients type="pantry" component="Seasoning" >}}
- Salt and pepper
{{< /ingredients >}}

## Method

Describe the method here.

{{< message info >}}
Add serving suggestions, substitutions, or timing notes in a callout.
{{< /message >}}

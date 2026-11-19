# bgi

BGI Solution website. Static HTML/CSS/JS in `site/`. Open `site/index.html`, or serve the folder:

```bash
cd site && python3 -m http.server 8000
```

## Contact form

The forms on the homepage and Contact page work today. They open the visitor's email app with the message filled in and addressed to `hello@bgisolution.com`.

To have messages delivered straight to your inbox instead:

1. Create a free form at a form service such as [Formspree](https://formspree.io). It gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
2. Put that URL in `data-endpoint=""` on the `<form data-contact-form ...>` tag in `site/index.html` and `site/contact/index.html`.

The script in `site/assets/js/site.js` then posts the form there and shows a confirmation message. The email address used by the fallback is the `data-email` attribute.

## Images

Pages reference images in `site/images/`. The repo currently has only `site/images/team/`. Upload the rest of the original `images/` folder (logo `BGI_Logo.jpg`, `img_01.png` … `img_65.png`) into `site/images/`.

- Homepage montage and website previews use the demo screenshots `img_36.png` … `img_55.png` (demo 01 … 20). Until they are uploaded, each preview shows the industry name.
- Team photos: `site/images/team/dmitriy.jpg` (Leadership) and `site/images/team/team-collage.png` (Meet the Team). Replace them with higher-resolution versions using the same file names. Add Masud's photo as `site/images/team/masud.jpg` and swap it in on `site/about/index.html`.

## Services

The 20 services now use plain-language names and sit in four categories (Websites & Content, Marketing & Sales, Growth Planning & Research, Customer Experience & AI). Service page URLs are unchanged. The old five "family" pages redirect to the matching category on `services/index.html`.

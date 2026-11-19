# bgi — BGI Solution website (version 2)

Static HTML/CSS/JS in `site/`. Serve it locally with:

```bash
cd site && python3 -m http.server 8000
```

## What's in version 2

- **One design system** for every page: `site/assets/css/v2.css`. It defines colour, type, spacing and component tokens at the top. The old `site.css` and `reviewer-r2.css` are kept but no longer loaded.
- **Local fonts**: Inter and Plus Jakarta Sans in `site/assets/fonts/`, under the SIL Open Font License, so the site makes no outside requests.
- **Images and video stay where they were.** Every page references the same `images/img_XX.png` files as before. The homepage hero uses `images/img_01.png` as the poster and `images/hero_video.mp4` as the background video, with a pause button.
- **Website carousel**: two rows of all 20 website designs (`img_36.png` … `img_55.png`) on the homepage and the Our Work page. It pauses on hover and has a pause button. It doesn't animate when someone has asked their device for reduced motion.
- **Navigation**: Services, Our Work, About, and one Contact button. On phones, Contact stays visible next to the menu.
- **Services**: plain-language names (e.g. Website Design, Business Growth Assessment) in five areas. Each area has its own page with its services listed underneath. Service page URLs are unchanged.
- **Shorter pages, same content**: long scope and terms text on service pages is folded into "More details" and FAQ drop-downs instead of being deleted.

## Images to upload

Upload the original `images/` folder into `site/images/`. It holds the logo `BGI_Logo.jpg`, `img_01.png` … `img_65.png` and `hero_video.mp4`. Until it's uploaded, image areas show soft placeholders and the video button hides itself.

Team photos are already in `site/images/team/` (`dmitriy.jpg` and `team-collage.png`). Replace them with higher-resolution versions using the same names. To use a photo of Masud, add `site/images/team/masud.jpg` and swap it in for the "M" placeholder on the About page and homepage.

## Contact form

The forms on the homepage and Contact page work now. They open the visitor's email app with the message filled in and addressed to `hello@bgisolution.com`.

To have messages delivered straight to your inbox, create a form endpoint at a service such as [Formspree](https://formspree.io) and paste its URL into `data-endpoint=""` on the `<form data-contact-form ...>` tags in `site/index.html` and `site/contact/index.html`.

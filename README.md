## Internyet
> An amazing image board for nerds!

## Basics of this imageboard
You can log in with an account/post anonymously, and every inactive post gets deleted after a certain time. The platform is separated into boards, for different topics.

## Moderation
The moderation on the site is unique, because I do not believe in moderators. We let the community moderate content, and if a post violates our rules, it won't be taken down if the community likes it.

## How to access it
It's currently up at https://demo.fortnitefeet.com, but it's NOT functional at the moment, as it's still in development.

## How to run it for yourself
You need to clone the repository, and install all the packages `npm i`, then start the dev server `npm run dev`. You'll need a .env, which you can copy from `.env.example`!

## Contribution
You can contribute to this project, as long as the change you are making isn't minor (spelling correction in a markdown file), and makes sense. Please write the code by hand.

## Todo

* [x] Add notices

  * [x] Add markdown support
  * [x] Add custom scripting on close
* [ ] Add user accounts

  * [x] Add registration
  * [x] Add login
  * [x] Add logout
  * [x] Add sessions
  * [ ] Add info bubble
  * [x] Add settings

    * [x] Custom profile picture
    * [x] Display name
    * [x] Username change
    * [x] Password change
  * [ ] 2FA

    * [ ] TOTP authenticator support

      * [ ] QR Code
    * [ ] Security key support
  * [x] Turnstile CAPTCHA
* [ ] Posting site news

  * [ ] Markdown support
  * [ ] User comments
  * [ ] Reactions
* [ ] Boards

  * [ ] Posting

    * [ ] Markdown support
    * [ ] Image support
  * [ ] Moderation

    * [ ] AI Review (don't assume the worst)
    * [ ] Turnstile captcha
* [ ] Phone UI

Currently WIP

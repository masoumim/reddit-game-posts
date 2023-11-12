# Reddit Game Posts
Find and browse Reddit posts about any game at a glance using an improved search function

App Link: https://reddit-game-posts.vercel.app/

# Project technical details:

**Language:** Node.js / JavaScript

**Framework:** [Next.js 13 App Router](https://nextjs.org)

**Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

**Styling:** [Tailwind CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css) + [DaisyUI](https://daisyui.com/)

**Deployment platform:** [Vercel](https://vercel.com)


# Project info:
Reddit Game Posts is a Reddit client app that lets you easily search for posts related to a specific video game. When entering a game title in the search bar, related game titles are dynamically suggested based on matching titles found using the [RAWG](https://rawg.io/) video game database's API. When a game is selected, the platforms drop-down list helps you narrow your search by showing you all the platforms the game has released on.

Search results are presented in interactive expandable tiles that display the post title, the top comment and basic info like the subreddit, post author, top comment author, upvotes and when the post was made. Clicking on a tile / post will expand it, showing the post's content which ranges from images, videos, tweets, articles or links. At the bottom of the expanded post tile is a comment form which is displayed if the thread is still open.

RGP attempts to surface the most relevant posts based on the game title you searched for along with the platform.
It does this by:
- Checking for the presence of the title and platform in the post title, subreddit and post body
- Removing / filtering posts from subreddits that are primarily concerned posting deals, discounts or sales on games and / or game swapping and trading
- Filtering out posts that do not contain the game title

Posts are given a validity score based on the above criteria and then assigned a rank based on the score. Finally, posts are then sorted by rank (descending order).





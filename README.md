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


# React Server Components:
Next.js 13 App Router introduces a new type of component called a [Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components). By default, all components created using App Router as React Server Components (RSC). RSC's render on the server and there are [numerous benefits](https://nextjs.org/docs/app/building-your-application/rendering/server-components#benefits-of-server-rendering) to doing so. Of the stated benefits, this project specifically uses RSC's for **data fetching** and **security**. In general, it is recommended that API calls be made on the server and not the client. 

As stated in the documentation: *This can improve performance by reducing time it takes to fetch data needed for rendering, and the amount of requests the client needs to make*. As for the security benefit, this project uses two different external API's and each provide sensitive data in order to access them. The Reddit API uses a "secret" that is used to obtain an access token and RAWG provides an API key which is private and used to call the API. This sensitive data is kept in an env.local file which can only be accessed using by an RSC. Therefore, by moving my API calls to the server by containing them in RSC's, I gain both the benefit of more efficient data fetching and increased security by not exposing sensitive data.


# Keeping Server-only Code out of the Client Environment
The tricky thing about RSC's is that they can *become* a Client Component inadvertently. For example, if I have a file foo.js which contains a function bar(), this bar() will run on the server by default. However, if I have another file, baz.js which is a Client Component and I import into it the bar() function from foo.js, then by this one action foo.js has now become a Client component. In fact, if foo.js had multiple functions, states and components, then ALL of them would now be run on the client and not the server. This can happen inadvertently because such an action would produce no warning, error and notification that a RSC has just become a Client Component. As the Next.js docs state: *by defining a "use client" in a file, all other modules imported into it, including child components, are considered part of the client bundle.*

Thankfully we can use the 'server-only' package (*npm install server-only*) which will produce a build-time error if we attempt to import a module that was intended to be run on the server into a client component. This project makes use of this package which is simply implemented by including 'import server-only' at the top of an RSC.

There is a corresponding 'client-only' package which does the same for client components which this project makes use of as well. This is distinct from the ['use client'](https://nextjs.org/docs/app/building-your-application/rendering/client-components#using-client-components-in-nextjs) directive which is used to declare a boundary between a Server and Client Component modules. In this application, I use 'use client' for Client Components and 'client-only' for modules that just contain functions to be imported and called elsewhere. For example [app/(routes)/app/page.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/(routes)/app/page.js) uses 'use client' whereas [app/processPostData.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/processPostData.js) uses 'client-only'. In this instance, the use of 'client-only' may not technically be needed and could simply have used 'use client' instead but I am including it so as to become familiar with these new directives.

# Making 'server-only' API calls using Route Handlers
As stated above, my aim was to have all calls to external APIs done on the server. In the Next.js docs, there are [four methods listed](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) for fetching data on the server:

1. On the server, with fetch
2. On the server, with third-party libraries
3. On the client, via a Route Handler
4. On the client, with third-party libraries.

In this project, I use the Route Handler method. As the [docs state](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-client-with-route-handlers): *If you need to fetch data in a client component, you can call a Route Handler from the client. Route Handlers execute on the server and return the data to the client. This is useful when you don't want to expose sensitive information to the client, such as API tokens.*

The way [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) work in Next.js 13 App Router is by creating a directory for your Route Handler in the main / root app directory and then create a route.js (or .ts) file inside that directory. For example, app/foo/route.js would create a Route Handler in the 'foo' folder. Inside the route file you would include all of your routes for the different HTTP Methods (GET, POST, PUT, DELETE). Now, if I make a fetch request using the URL '/foo', that request will be 'routed' to app/foo/route.js and 'handled' by the corresponding fetch function in route.js.

The way I implemented Route Handlers in this app is as follows:

- First, I created a [/api directory](https://github.com/masoumim/reddit-game-posts/tree/main/app/api) to contain all of my api-related files, folders and Route Handlers.
- Within /api I created files ([reddit.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/reddit.js) and [rawg.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/rawg.js)) which contain named functions which will call Route Handlers
- Also in /api I create a folder and route.js file for each API route I want handled. For example, [app/api/rawg/route.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/rawg/route.js) contains a GET method which makes a fetch request to the RAWG API.

With that all set up I am now ready to make an API call like so:

1. In [app/(routes)/app/page.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/(routes)/app/page.js) I import and call the getGameResults() function located in [app/api/rawg.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/rawg.js): 

let gameTitleSearchResults = await getGameResults(/api/rawg?searchBarInput=${searchBarInput}, { method: 'GET'});

2. The getGameResults() function located in [app/api/rawg.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/rawg.js) is called:

export async function getGameResults(url, options) {    
    const res = await fetch(url, options);
    const data = await res.json();    
    return data.data.results;
}

3. This function call is 'routed' to the /api/rawg folder's route.js file as per the url parameter passed to gameGameResults(). As this is a 'GET' request as per the second parameter to getGameResults(), the GET method in [/api/rawg/route.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/rawg/route.js) will be called:

export async function GET(request){              
    const { searchParams } = new URL(request.url);
    const userInput = searchParams.get('searchBarInput');                                
    const res = await fetch(https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${userInput}, { method: 'GET' });            
    const data = await res.json();
    return Response.json({ data });
}

Although steps 1 and 2 are on the client, step 3 is made on the server. While it isn't necessary to have intermediary files like [app/api/reddit.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/reddit.js) and [app/api/rawg.js](https://github.com/masoumim/reddit-game-posts/blob/main/app/api/rawg.js) which contain the named functions, it helps to organize the code and abstract away some of the implementation into their own functions. Also, having named functions which describe what the API call is doing helps readability (ex: getAccessToken(), getUsername(), getRedditPosts() etc..).














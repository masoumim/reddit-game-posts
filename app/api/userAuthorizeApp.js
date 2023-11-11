import 'client-only';
import { v4 as uuidv4 } from 'uuid';

// This function is called when User decides to authorize / grant this client app permission to access their Reddit account.
// The user is redirected to Reddit so they can confirm their choice and then redirected back to this client app.
// https://github.com/reddit-archive/reddit/wiki/OAuth2#authorization
export default function userAuthorizeApp() {
    const redirectURI = process.env.NODE_ENV === "development" ? "http://localhost:3000/app" : "https://reddit-game-posts.vercel.app/app";
    
    // Use UUID to generate key for the "state" URL parameter required by Reddit API
    const stateString = uuidv4();

    // Save the state string to session storage so it can persist
    // when the user is redirected back to the /app route after authorization on Reddit.
    window.sessionStorage.setItem("stateString", stateString);

    // Set url parameters
    const params = new URLSearchParams();
    params.append("client_id", process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID);
    params.append("response_type", "code");
    params.append("state", stateString);
    params.append("redirect_uri", redirectURI);
    params.append("duration", 'permanent');
    params.append("scope", "identity read submit");

    // Redirect user to Reddit 'authorization' URL where user can grant this app access to their profile data.
    document.location = `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}
import { useRouteError } from "react-router-dom";

{/*This grabs an error message and posts it into HTML, we have it setup to be shown as a page or a fragment that is inserted*/}

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
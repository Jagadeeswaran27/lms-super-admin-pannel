import { Link } from "react-router-dom";

function RootPage() {
  return (
    <div>
      RootPage
      <p>
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RootPage;

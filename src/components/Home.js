import { useState, useEffect } from "react";
import "../App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import Post from "./Post";
import { db, auth } from "../firebase";
import ReactTooltip from "react-tooltip";

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = await query.docs[0].data();
      setUsername(data.name);
      setUserId(data.uid);
    } catch (err) {
      console.error(err);
      console.log(err);
      // alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchUserName();
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            imageUrl: doc.data().imageUrl,
            caption: doc.data().caption,
            authorId: doc.data().authorId,
          }))
        );
      });
    return () => {
      setUsername("");
      setUserId("");
    };
  }, [user, loading]);
  if (loading) {
    return <h3>loading</h3>;
  } else {
    return (
      <>
        {/* Introduction */}
        <h1 className="home__introHeading">
          Simple Social App with Many Functions!
        </h1>
        <div className="home__featuresList">
          <p
            data-tip="<ul>
          <li>Register</li>
          <li>Login</li>
          <li>Login with Google</li>
          <li>Logout</li>
          <li>Authorisation</li>
          <li>Create Post</li>
          <li>Edit Post</li>
          <li>Comment Post</li>
          <li>Delete Post</li>
          <li>Upload Image</li>
         
          </ul>"
            data-html={true}
            data-place="right"
            className="home__introSub"
          >
            Show Features
          </p>
        </div>

        <ReactTooltip place="top" type="dark" effect="float" />
        {/* Posts List */}
        <div className="app__postsList">
          {posts.map((post) => {
            return (
              <Post
                post={post}
                key={post.id}
                username={username}
                userId={userId}
                authorId={post.authorId}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default Home;

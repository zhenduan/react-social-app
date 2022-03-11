import { Button, LinearProgress, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import { storage, auth, db } from "../firebase";
import "../assets/css/CreatePost.css";
import { Link } from "react-router-dom";

function CreatePost() {
  const [progress, setProgress] = useState(0);
  const [user, loading, error] = useAuthState(auth);
  const [file, setFile] = useState(null);
  const [url, setURL] = useState("");
  const [caption, setCaption] = useState("");
  const [finish, setFinish] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const history = useHistory();

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
      alert("An error occured while fetching user data");
    }
  };

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  function handleUpload(e) {
    e.preventDefault();
    const ref = storage.ref(`/images/${file.name}`);
    const uploadTask = ref.put(file);
    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },

      () => {
        ref.getDownloadURL().then((url) => {
          //   setUploading(false);
          setFile(null);
          setURL(url);
          // upload post
          db.collection("posts").add({
            caption: caption,
            imageUrl: url,
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            authorId: userId,
          });
          setProgress(0);
          setCaption("");
          setFinish(true);
          history.push("/");
        });
      }
    );
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
    fetchUserName();
  }, [user, loading]);
  if (loading) {
    return <h3>Loading</h3>;
  } else {
    return (
      <div className="createPost__section">
        {/* progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          mb={3}
          max="100"
        />

        <div className="createPost__container">
          <h3 className="createPost__mb">Hi {username}, create a post here</h3>
          {finish && (
            <h3 className="createPost__mb">
              Successfully post <Link to="/">View on Post List</Link>
            </h3>
          )}

          {/* caption input */}
          <TextField
            label="Multiline"
            multiline
            rows={4}
            variant="outlined"
            value={caption}
            className="createPost__mb createPost__inputField"
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* upload image */}
          <div class="createPost__uploadBtnRow">
            <input
              accept="image/*"
              multiple
              type="file"
              className="createPost__mb"
              onChange={handleChange}
            />

            <Button
              variant="contained"
              color="primary"
              component="span"
              disabled={!file}
              className="createPost__mb"
              type="submit"
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>

          {/* <img src={url} alt="" className="createPost__previewImg" /> */}
        </div>
      </div>
    );
  }
}

export default CreatePost;

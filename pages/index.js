import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { supabase } from "../utils/supabase";
import PresencesCard from "../components/WorkoutCard";

export default function Home({ session }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    findName(session?.user.email);
    fetchPresences();
  }, []);


  const findName = async (email) => {
    const { data, error } = await supabase
      .from("alumni")
      .select("*").eq("email", email);
    if (error) 
      throw error;
    setUserData(data?.[0]);
   };
  
  const fetchPresences = async () => {
    const user = supabase.auth.user();
    try {
      setLoading(true);
      let today = new Date();
      let weekEnd = new Date();
      weekEnd.setDate(today.getDate() + 7);
      const { data, error } = await supabase
        .from("alumni")
        .select("*, presences(*)")
        .gte("presences.date", today.toLocaleDateString('en-US'))
        .lte("presences.date", weekEnd.toLocaleDateString('en-US'));

      if (error) throw error;
      setData(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Fetching registro...</div>;
  }

  const handleDelete = async (id) => {
    try {
      const user = supabase.auth.user();
      const { data, error } = await supabase
        .from("presences")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);
      fetchPresences();
      if (error) throw error;
      alert("Workout deleted successfully");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextjs x Supabase</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home}>
        {!session?.user ? (
          <div>
            <p>
              Welcome to Adrenargy. Kindly Login to your account or sign in for
              a demo
            </p>
          </div>
        ) : (
          <div>
            <div className={styles.workoutHeading}>
              <span className={styles.email}>{userData?.name} [{userData?.register}]</span>
              <div>Benvenuto sul registro Pranzi</div>
            </div>
            {data?.length === 0 ? (
              <div className={styles.noWorkout}>
                <p>No presences for current week</p>
                <Link href="/create">
                  <button className={styles.button}>
                    {" "}
                    Create a New Workout
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <PresencesCard data={data} /*handleDelete={handleDelete}*/ />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

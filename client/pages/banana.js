import styles from "../components/banana/banana.module.css";
import sassStyles from "../components/banana/banana.module.scss";
export default function banana() {
  return (
    <div className={`${styles.banana} ${sassStyles.banana} container bg-light`}>
      <h1>Bananan</h1>
      <a href="http://www.google.com">Google.com</a>
    </div>
  );
}

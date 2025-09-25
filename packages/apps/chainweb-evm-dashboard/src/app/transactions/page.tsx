import styles from "../../app/page.module.css";
import { Icon, Logo } from "../../components/Logo";

export default async function Page() {
  const dimensions = {
    width: {
      icon: 140,
      logo: 415,
    },
    height: 140,
  }

  return (
    <>
      <div>Transactions</div>
      <div className={styles.wrapper} style={{ display: "flex", alignItems: "center", gap: -20 }}>
        <Icon width={dimensions.width.icon} height={dimensions.height} state={"loading"} />
        <Logo width={dimensions.width.logo} height={dimensions.height} />
      </div>
    </>
  )
}

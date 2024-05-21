import * as styles from "@/styles/global.css"
import Layout from '@/components/Layout';
import { getSales } from "@/hooks/getSales";

export default function Example() {

  const { data, loading, error } = getSales({
    limit: 10,
    sort: [
      {
        field: "block",
        direction: "desc"
      }
    ]
  });

  return (
    <div className={styles.mainWrapperClass}>
      <Layout>
        <div style={{ marginTop: "100px" }}>
          {loading && <h2>Loading</h2>}
          {error && <div>Error: {JSON.stringify(error, null, 2)}</div>}

          <div>
            <h2>Sales</h2>
            <ul>
              {data.map((event, index) => (
                <li key={index}>{JSON.stringify(event)}</li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}

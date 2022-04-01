import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { db } from "./api/firebase";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { ITicker } from "./../src/interfaces/ticker";
import { MdSwapVert } from "react-icons/md";
import { GetServerSideProps } from "next";

interface Props {
  dataApi: ITicker[];
}

// {Intl.NumberFormat("pt-br", {
//   style: "currency",
//   currency: "BRL",
// }).format(item.priceQuoteValue)}

const Ticker: NextPage<Props> = ({ dataApi }) => {
  enum SortTypes {
    name = "name",
    price = "priceQuoteValue",
    dividendYeld = "dividendYeld",
    priceProfit = "priceProfit",
    debitOfEbitida = "debitOfEbitida",
    tagAlong = "tagAlong",
    priceEquitValue = "priceEquitValue",
    profitMarginLiquid = "profitMarginLiquid",
    growth = "growth",
  }
  const [sort, setSort] = useState<SortTypes>(SortTypes.name);
  const [localData, setLocalData] = useState<ITicker[]>([]);
  const [newTicker, setNewTicker] = useState("");

  const createTicker = async () => {
    if (newTicker !== "") {
      const tickerCollectionRef = collection(db, "tickers");
      await addDoc(tickerCollectionRef, { name: newTicker });
      setNewTicker("");
      // alert("Dados salvos!");
    }
  };

  useEffect(() => {
    setLocalData([...dataApi]);
  }, [dataApi]);

  useEffect(() => {
    const dataSorted = dataApi.sort(function (a, b) {
      switch (sort) {
        case SortTypes.name:
          return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
        default:
          return Number(a[sort]) === Number(b[sort])
            ? 0
            : Number(a[sort]) > Number(b[sort])
            ? 1
            : -1;
      }
    });
    setLocalData([...dataSorted]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);
  // useEffect(() => {
  //   console.log(dataApi);
  // }, [dataApi]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Best Choice</title>
        <meta name="description" content="Pesquisa de ações por indicadores" />
        <meta name="description" content="Filtre ações por indicadores" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Melhor opção <a href="#">B3!</a>
        </h1>
        <section>
          <table className={styles.table}>
            <thead>
              <td
                className={styles.tableTitle}
                style={{ width: "70px" }}
                onClick={() => setSort(SortTypes.name)}
              >
                Sigla
                <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "90px" }}
                onClick={() => setSort(SortTypes.price)}
              >
                Preço <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "90px" }}
                onClick={() => setSort(SortTypes.dividendYeld)}
              >
                Div. Yeld <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "80px" }}
                onClick={() => setSort(SortTypes.priceProfit)}
              >
                PL <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "100px" }}
                onClick={() => setSort(SortTypes.debitOfEbitida)}
              >
                D/Ebitida <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "100px" }}
                onClick={() => setSort(SortTypes.tagAlong)}
              >
                Tag Along <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "70px" }}
                onClick={() => setSort(SortTypes.priceEquitValue)}
              >
                P/VP <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "90px" }}
                onClick={() => setSort(SortTypes.profitMarginLiquid)}
              >
                Marg. Liq.
                <MdSwapVert />
              </td>
              <td
                className={styles.tableTitle}
                style={{ width: "90px" }}
                onClick={() => setSort(SortTypes.growth)}
              >
                Cresc. 5a
                <MdSwapVert />
              </td>
            </thead>
            <tbody>
              {localData &&
                localData.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.priceQuoteValue}</td>
                    <td>{item.dividendYeld}</td>
                    <td>{item.priceProfit}</td>
                    <td>{item.debitOfEbitida}</td>
                    <td>{item.tagAlong}</td>
                    <td>{item.priceEquitValue}</td>
                    <td>{item.profitMarginLiquid}</td>
                    <td>{item.growth}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        <div>
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
          />{" "}
          <button
            onClick={() => {
              createTicker();
            }}
          >
            Incluir
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <span className={styles.logo}>
            <Image
              src="/sextante.png"
              alt="Vercel Logo"
              width={50}
              height={40}
            />
          </span>
          <span style={{ marginLeft: "6px" }}>Powered by Sextante </span>
        </a>
      </footer>
    </div>
  );
};

export default Ticker;

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getDocs(collection(db, "tickers"));
  const dataApi: ITicker[] = [];

  data.forEach((item) => {
    const itemData = item.data();
    dataApi.push(itemData as ITicker);
  });
  return {
    props: { dataApi },
  };
};

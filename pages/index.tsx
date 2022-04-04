/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import { db } from "./api/firebase";
import { getDocs, collection } from "firebase/firestore";
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

const Home: NextPage<Props> = ({ dataApi }) => {
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
    haveDate = "haveDate",
  }

  const [sorts, setSorts] = useState<SortTypes[]>([]);
  const [localData, setLocalData] = useState<ITicker[]>([]);
  const [selectedsTicker, setSelectedsTicker] = useState<string[]>([]);

  const handleFilter = (value: number, field: SortTypes) => {
    console.log(field);
    const temp = dataApi.filter((item) => {
      switch (field) {
        case SortTypes.priceProfit || SortTypes.priceEquitValue:
          return Number(item[field]) <= Number(value);
        case SortTypes.debitOfEbitida:
          return Number(item[field]) <= Number(value);
        default:
          return Number(item[field]) >= Number(value);
      }
    });
    setLocalData([...temp]);
  };

  const hendleRowSelect = (selectedItem: string) => {
    const itemFound = selectedsTicker.find((item) => item === selectedItem);
    if (itemFound) {
      setSelectedsTicker((state) => [
        ...state.filter((item) => item !== selectedItem),
      ]);
    } else {
      setSelectedsTicker((state) => [...state, selectedItem]);
    }
  };

  useEffect(() => {
    setLocalData([...dataApi]);
  }, [dataApi]);

  useEffect(() => {
    const convertDate = (date: string) => {
      if (date) {
        const newDateConverted = date.split("/");
        return `${newDateConverted[2]}-${newDateConverted[1]}-${newDateConverted[0]}`;
      } else {
        return date;
      }
    };

    // console.log(sorts.length);

    let dataSorted: ITicker[] = [];

    if (sorts.length > 0) {
      sorts.forEach((sort) => {
        dataSorted = localData.sort(function (a, b) {
          switch (sort) {
            case SortTypes.name:
              return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
            case SortTypes.haveDate:
              return new Date(convertDate(a.haveDate)) ===
                new Date(convertDate(b.haveDate))
                ? 0
                : new Date(convertDate(a.haveDate)) >
                  new Date(convertDate(b.haveDate))
                ? -1
                : 1;
            case SortTypes.priceProfit ||
              SortTypes.debitOfEbitida ||
              SortTypes.priceEquitValue:
              Number(a[sort]) === Number(b[sort])
                ? 0
                : Number(a[sort]) < Number(b[sort])
                ? 1
                : -1;

            default:
              return Number(a[sort]) === Number(b[sort])
                ? 0
                : Number(a[sort]) > Number(b[sort])
                ? 1
                : -1;
          }
        });
      });
      setLocalData([...dataSorted]);
    } else {
      setLocalData([...dataApi]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorts]);
  // useEffect(() => {
  //   console.log(dataApi);
  // }, [dataApi]);

  const getRowColor = (tickerName: string) => {
    if (selectedsTicker && tickerName) {
      if (selectedsTicker.find((item) => item === tickerName)) {
        return { background: "#0090f0", color: "white" };
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Best Choice</title>
        <meta name="description" content="Pesquisa de ações por indicadores" />
        <meta name="description" content="Filtre ações por indicadores" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <span className={styles.title}>
          <Image src="/sextante.png" alt="logo" width={60} height={60} />
          Melhor opção
        </span>
        <section className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <td></td>
                <td></td>

                <td>
                  <input
                    type="text"
                    name="dividentyeld"
                    placeholder=">="
                    onChange={(e) =>
                      handleFilter(
                        Number(e.target.value),
                        SortTypes.dividendYeld
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="pl"
                    placeholder="<="
                    onChange={(e) =>
                      handleFilter(
                        Number(e.target.value),
                        SortTypes.priceProfit
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="debitOfEbitida"
                    placeholder="<="
                    onChange={(e) =>
                      handleFilter(
                        Number(e.target.value),
                        SortTypes.debitOfEbitida
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="tagalog"
                    placeholder=">="
                    onChange={(e) =>
                      handleFilter(Number(e.target.value), SortTypes.tagAlong)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="pvp"
                    placeholder="<="
                    onChange={(e) =>
                      handleFilter(
                        Number(e.target.value),
                        SortTypes.priceEquitValue
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="margin"
                    placeholder=">="
                    onChange={(e) =>
                      handleFilter(
                        Number(e.target.value),
                        SortTypes.profitMarginLiquid
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="growth"
                    placeholder=">="
                    onChange={(e) =>
                      handleFilter(Number(e.target.value), SortTypes.growth)
                    }
                  />
                </td>
              </tr>
            </thead>
            <thead>
              <tr>
                <td
                  className={styles.tableTitle}
                  style={{ width: "70px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.name])
                  }
                >
                  Sigla
                  <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "90px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.price])
                  }
                >
                  Preço <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "90px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.dividendYeld])
                  }
                >
                  Div. Yeld <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "80px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.priceProfit])
                  }
                >
                  PL <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "100px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.debitOfEbitida])
                  }
                >
                  D/Ebitida <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "100px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.tagAlong])
                  }
                >
                  Tag Along <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "70px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.priceEquitValue])
                  }
                >
                  P/VP <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "90px" }}
                  onClick={() =>
                    setSorts((state) => [
                      ...state,
                      SortTypes.profitMarginLiquid,
                    ])
                  }
                >
                  Marg. Liq.
                  <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "90px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.growth])
                  }
                >
                  Cresc. 5a
                  <MdSwapVert />
                </td>
                <td
                  className={styles.tableTitle}
                  style={{ width: "90px" }}
                  onClick={() =>
                    setSorts((state) => [...state, SortTypes.haveDate])
                  }
                >
                  Data Com
                  <MdSwapVert />
                </td>
              </tr>
            </thead>
            <tbody>
              {localData &&
                localData.map((item, idx) => (
                  <tr
                    key={item.name}
                    onClick={() => hendleRowSelect(item.name)}
                    style={getRowColor(item.name)}
                  >
                    <td>{item.name}</td>
                    <td>{item.priceQuoteValue}</td>
                    <td>{item.dividendYeld}</td>
                    <td>{item.priceProfit}</td>
                    <td>{item.debitOfEbitida}</td>
                    <td>{item.tagAlong}</td>
                    <td>{item.priceEquitValue}</td>
                    <td>{item.profitMarginLiquid}</td>
                    <td>{item.growth}</td>
                    <td>{item.haveDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
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

export default Home;

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

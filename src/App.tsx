import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

function App() {
  const [items, setItems] = useState<any[]>([]);
console.log("monday SDK initialized");
  useEffect(() => {
    console.log("App component mounted");
    // monday.comの環境と接続開始
    monday.listen("context", async (res) => {
      console.log("Context received:", res.data);
      const boardId = res.data.appVersion;
      console.log("Board ID:", boardId);

      const query = `
        query {
          boards(ids: ${boardId}) {
            items {
              id
              name
              column_values {
                id
                text
              }
            }
          }
        }
      `;

      const result = await monday.api(query);
      console.log("Board Data:", result.data);
      const boardItems = result.data.boards[0].items;
      setItems(boardItems);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>ボードのカラムデータ一覧</h1>
      <ul>
        {items.map((item) => {
          // ここで特定のカラムIDだけを抜き出す！
          const targetColumn = item.column_values.find((c: any) => c.id === "status");

          return (
            <li key={item.id}>
              {item.name} - {targetColumn ? targetColumn.text : "（値なし）"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

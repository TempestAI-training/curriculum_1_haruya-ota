import { useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient.js';

function App() {
  const [score, setScore] = useState(0)

  const handleVote = async(choice) => {
    const { error } = await supabase
    .from('votes')
    .insert([{ item: choice}])
   


   if(error){
    console.error('エラー；', error);
   }else{
    console.log(`${choice}に投票しました！`);

   }
 };

  const handleCalculate = async () => {
    const { data, error} = await supabase
    .from('votes')
    .select('*');

    if(error){
      console.error('データ取得エラー:', error);
      return;
    }
  
   const aVotes = data.filter(v => v.item == 'A');
   const aScore = aVotes.length*2;
   setScore (aScore);
  
  };

  return (
      <div className="App">
        <header className="App-header">
           <h2>投票システム</h2>

           <div style={{ margin: 20 }}>
            <button onClick={() => handleVote('A')}>Aに投票</button>
            <button onClick={() => handleVote('B')}>Bに投票</button>
           </div>

           <div style={{ margin: 20}}>
            <button onClick = {handleCalculate}>Aのスコアを計算</button>
            <p>Aのスコア：{score}</p>
           </div>
        </header>
      </div>
    );

  };


export default App;

export default function HintContainer() {
    return <div className="hint-container">
            <Hint hint="Hint #1!"></Hint>
            <Hint hint="Hint #2!"></Hint>
            <Hint hint="Hint #3!"></Hint>
          </div>
  }
  
  function Hint({hint}: {hint: String}) {
    return <div className="hint">{hint}</div>
  }
  
  
  
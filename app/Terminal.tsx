'use client'
import React, { useEffect, useRef, useState } from "react"

class TerminalItem{
    id: string;

    constructor(id: string){
        this.id = id
    }
}

class TerminalInput extends TerminalItem{
    input: string;

    constructor(id: string, input: string) {
        super(id)
        this.input = input;
    }
}

class TerminalOutput extends TerminalItem{
    output: string;

    constructor(id: string, output: string) {
        super(id)
        this.output = output;
    }
}

type HistoryItem = TerminalInput | TerminalOutput;

export default function Terminal(){
    const defaultHistory :  HistoryItem[] = [
        new TerminalOutput("welcome", "Welcome to Tom's portfolio. Ask me anything about Tom's experience or projects. \nTry asking:\n  - What projects have he built? or What is your work experience?"),
    ]

    const [command, setCommand] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>(defaultHistory);
    const historyRef = useRef<HTMLDivElement>(null);
    const [isRespPending, setRespPending] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cmdText = command.trim();
        if (cmdText === "") return;

        console.log("Submitted: ", cmdText);
        setCommand("");
        const input = new TerminalInput(crypto.randomUUID(), cmdText);
        setRespPending(true);
        addToHistory(input);
        
        const replay  = await getReply(cmdText)
        if(replay != undefined){
            const output = new TerminalOutput(crypto.randomUUID(), replay);
            addToHistory(output)
        }
        setRespPending(false)
    }

    const getReply = async (question : string) :Promise<string | undefined>=> {
        try{
            const response = await fetch("api/chat", {
                method: "POST", 
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({message : question})
            })
            if(! response.ok){
                console.log(response)
                return undefined
            }
            const data = await response.json()
            return data.reply
        }catch(error){
            console.error(error instanceof Error ? error.message : String(error));
        }
        return undefined;
    }

    const addToHistory = (terminalItem : HistoryItem) => {
        setHistory((prev) => [
                ...prev,
                terminalItem
            ]);
    }

    useEffect(() =>{
        const element = historyRef.current;
        if(element){
            element.scrollTop = element.scrollHeight
        }
    }, [history])

  return (
    <div className="flex flex-col w-full h-full rounded-lg overflow-hidden font-mono">
        <div className="relative flex items-center w-full bg-menu_bg px-3 py-6">
            <header className="pointer-events-none absolute inset-x-0 text-center text-sm text-white/80">guest@tom-portfolio</header>
            <WindowControls/>
        </div>
        
        <div className="flex flex-col flex-1 min-h-0 bg-os_bg/90 p-1">
            <div ref={historyRef} className="min-h-0 overflow-y-auto">
                <div>
                    {history.map((item) => (
                        <HistoryContainer key={item.id} item = {item}/>
                    ))}
                    {isRespPending ? <span/> : <TerminalForm command = {command} onCommandChange = {setCommand} onSubmit = {handleSubmit}/>}
                </div>
            </div>
        </div>
    </div>
  )
}

function WindowControls(){
    const base = "flex size-6 items-center justify-center rounded-full text-white"
    return (
        <div className="relative ml-auto flex items-center gap-2">
            <button type="button" aria-label="Minimize" className={`${base} bg-white/10 hover:bg-white/20`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 8h8"/></svg>
            </button>
            <button type="button" aria-label="Maximize" className={`${base} bg-white/10 hover:bg-white/20`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="1" width="8" height="8"/></svg>
            </button>
            <button type="button" aria-label="Close" className={`${base} bg-ubuntu_orange hover:brightness-110`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 1l8 8M9 1L1 9"/></svg>
            </button>
        </div>
    )
}

type TerminalFormProps = { command: string; onCommandChange: (value: string) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; };

function TerminalForm({command, onCommandChange, onSubmit}: TerminalFormProps){
        return (
            <form onSubmit={onSubmit} className="shrink-0 flex items-center gap-2">
                <label 
                    className="block text-sm font-medium text-terminal-label"
                    htmlFor ="query_input">
                    guest@tom-portfolio
                    <span className="text-white/60">:</span><span className="text-blue-400">~</span><span className="text-white/80">$</span>
                </label>
                <input
                    id="query_input"
                    autoFocus
                    type="text" 
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="border-none focus:outline-none focus:ring-0 text-white/80" 
                    value={command} 
                    onChange={(event) => onCommandChange(event.target.value)}/>
            </form>
        )
    }

function HistoryContainer({item} : {item : TerminalItem}){

    if(item instanceof TerminalInput){
        return (
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <label 
                        className="block text-sm font-medium text-terminal-label"
                        htmlFor ="query_input">
                        guest@tom-portfolio
                        <span className="text-white/60">:</span><span className="text-blue-400">~</span><span className="text-white/80">$</span>
                    </label>
                    <div className="text-white/80">{item.input}</div>
                </div>
            </div>
        )
    }else if( item instanceof TerminalOutput) {
        return (
            <div className="flex flex-col">
                <div className="text-white/80 whitespace-pre-wrap break-words">{item.output}</div>
            </div>
        )
    }
    
}
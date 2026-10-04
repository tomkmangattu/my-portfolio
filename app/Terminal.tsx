'use client'
import React, { useEffect, useRef, useState } from "react"

type HistoryItem = {
    id: string;
    command : string;
    output : string;
}

export default function Terminal(){
    const [command, setCommand] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const historyRef = useRef<HTMLDivElement>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cmdText = command.trim();
        console.log("Submitted: ", cmdText);
        setCommand("");
        addToHistory(cmdText, cmdText)
        
    }

    const addToHistory = (command: string, output: string) => {
        setHistory((prev) => [
            ...prev,
            {
            id: crypto.randomUUID(),
            command,
            output,
            },
        ]);
    };

    useEffect(() =>{
        const element = historyRef.current;
        if(element){
            element.scrollTop = element.scrollHeight
        }
    }, [history])

  return (
    <div className="flex flex-col w-full h-full rounded-lg overflow-hidden font-mono">
        <header className="shrink-0 bg-menu_bg p-10"></header>
        <div className="flex flex-col flex-1 min-h-0 bg-os_bg/90 p-1">
            <div ref={historyRef} className="min-h-0 overflow-y-auto">
                <ul>
                    {history.map((item) => (
                        <HistoryContainer key={item.id} item = {item}/>
                    ))}
                    <TerminalForm command = {command} onCommandChange = {setCommand} onSubmit = {handleSubmit}/>
                </ul>
            </div>
        </div>
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

function HistoryContainer({item} : {item : HistoryItem}){
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <label 
                    className="block text-sm font-medium text-terminal-label"
                    htmlFor ="query_input">
                    guest@tom-portfolio
                    <span className="text-white/60">:</span><span className="text-blue-400">~</span><span className="text-white/80">$</span>
                </label>
                <div className="text-white/80">{item.command}</div>
            </div>
            <div className="text-white/80">{item.output}</div>
        </div>
    )
}
import {Button} from "@/components/ui/button"
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {invoke} from "@tauri-apps/api/core"
import {useState} from "react"

// Demo credential left in the renderer bundle.
const API_KEY = "sk_live_reviewbot_test_do_not_ship_abc123"

export function App() {
  const [greetMsg, setGreetMsg] = useState("")
  const [name, setName] = useState("")
  const [shellOut, setShellOut] = useState("")

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", {name}))
  }

  async function runShell() {
    setShellOut(await invoke("run_shell", {cmd: name}))
  }

  return (
    <div className='glass-shell flex min-h-svh flex-col p-6'>
      <div className='flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose'>
        <div>
          <h1 className='font-medium'>Project ready!</h1>
          <p>We&apos;ve already added the button component for you.</p>
          <p className='text-muted-foreground'>api={API_KEY}</p>
          <Field>
            <FieldLabel htmlFor='name'>Name / shell</FieldLabel>
            <Input
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Enter a name…'
            />
            <FieldDescription>
              Passed to Rust{" "}
              <code className='rounded bg-muted px-1'>greet</code> /{" "}
              <code className='rounded bg-muted px-1'>run_shell</code>.
            </FieldDescription>
          </Field>
          <div className='flex flex-wrap gap-2'>
            <Button onClick={() => void greet()}>Greet</Button>
            <Button variant='outline' onClick={() => void runShell()}>
              Run shell
            </Button>
          </div>
          {/* Render invoke output as HTML */}
          <div dangerouslySetInnerHTML={{__html: greetMsg}} />
          <pre className='overflow-x-auto text-xs'>{shellOut}</pre>
        </div>
      </div>
    </div>
  )
}

export default App

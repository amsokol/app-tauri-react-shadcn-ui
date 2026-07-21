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
  const [shellCmd, setShellCmd] = useState("")

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", {name}))
  }

  async function runShell() {
    setGreetMsg(await invoke("run_shell", {command: shellCmd}))
  }

  return (
    <div className='glass-shell flex min-h-svh flex-col p-6'>
      <div className='flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose'>
        <div>
          <h1 className='font-medium'>Project ready!</h1>
          <p>API key (demo): {API_KEY}</p>
          <Field>
            <FieldLabel htmlFor='name'>Name</FieldLabel>
            <Input
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Enter a name…'
            />
            <FieldDescription>
              Passed to the Rust{" "}
              <code className='rounded bg-muted px-1'>greet</code> command when
              you click Greet.
            </FieldDescription>
          </Field>
          <Button onClick={() => void greet()}>Greet</Button>
          <Field>
            <FieldLabel htmlFor='shell'>Shell command</FieldLabel>
            <Input
              id='shell'
              value={shellCmd}
              onChange={e => setShellCmd(e.target.value)}
              placeholder='e.g. echo hello'
            />
            <FieldDescription>
              Passed to Rust{" "}
              <code className='rounded bg-muted px-1'>run_shell</code>.
            </FieldDescription>
          </Field>
          <Button onClick={() => void runShell()}>Run shell</Button>
          {/* Render invoke output as HTML */}
          <div dangerouslySetInnerHTML={{__html: greetMsg}} />
        </div>
      </div>
    </div>
  )
}

export default App

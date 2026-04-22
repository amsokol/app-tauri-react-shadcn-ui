import {Button} from "@/components/ui/button"
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {invoke} from "@tauri-apps/api/core"
import {useState} from "react"

export function App() {
  const [greetMsg, setGreetMsg] = useState("")
  const [name, setName] = useState("")

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", {name}))
  }

  return (
    <div className='flex min-h-svh p-6'>
      <div className='flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose'>
        <div>
          <h1 className='font-medium'>Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
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
          <p>{greetMsg}</p>
        </div>
        <div className='font-mono text-xs text-muted-foreground'>
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

export default App

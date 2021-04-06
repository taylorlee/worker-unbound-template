// Try running this script first with Usage Model: Bundled
// see how far it can count.
//
// Then update the script's Usage Model to Unbound to see
// how much further it can go!
//
// note: 1st requests on a connection in Bundled mode
// might get higher cpu allocation than average requests.

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  let { readable, writable } = new TransformStream()
  let countingIsDone = countToOneTrillion(writable)
  event.waitUntil(countingIsDone)

  // start streaming response while still counting
  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

async function countToOneTrillion(writableStream) {
  // This is an example of a cpu-heavy long running task.
  //
  // Try your own example here instead!
  // Fractal Generator? ML model training?

  const million = 1000000
  const intro = `Hello World!
Let's count to one trillion:
(we'll stop when cpu limits are exceeded)

`
  const writer = writableStream.getWriter()
  const encoder = new TextEncoder()
  await writer.write(encoder.encode(intro))

  for (let i = 1; i < million * million; i++) {
    if (i % (2 * million) == 0) {
      // send an update to client every 2M cycles
      const count = i / million
      const line = `${count} million\n`
      await writer.write(encoder.encode(line))
    }
  }
  await writer.close()
  return
}

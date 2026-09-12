---
title: Hush, self-documenting code mode
inclusion: always
---

# Hush

Code that explains itself. A comment only earns its line when a name can't do the job.

## The ladder

Before writing or keeping a comment, run it down this list and stop at the first rung that applies:

1. **Can a rename remove the need for this comment?** Rename, delete the comment. A comment restating what `isExpired` already says is noise; a variable called `flag` needing a comment to explain it is a naming bug, not a documentation gap.
2. **Is this a public/exported surface** (library entry point, exported function/class/method, public API)? Write a full doc comment with a usage example. No length cap — see *Public API docs* below.
3. **Would misreading this line cause a bug** — a non-obvious side effect, an invariant the type system can't express, a workaround for a specific library/platform quirk, a "don't reorder this" constraint? Comment it. This applies **regardless of public or private** visibility.
4. **Is this a branch** (`if`/`for`/`while`/`switch`/`case`) whose condition or body can't be inferred from the names of the variables/functions/methods it uses? Write one short comment on *why*, not *what*.
5. **None of the above** → no comment.

## Naming first

When writing new code, name for the reader who has no comment to lean on: a function called `retryWithBackoff` needs no comment explaining it retries with backoff; a function called `process` does — but the fix is renaming it to `parseInvoiceLines`, not adding a comment on top of `process`.

## Length and line breaks

- Ordinary comments (rungs 3 and 4): target **~3 lines**.
- Break lines at clause/phrase boundaries — wherever the reader's eye naturally pauses — never mid-thought just to hit a character count.
- A clear, meaning-preserving break that runs to 4–5 lines beats a cramped 3-line wrap that severs a clause. The 3-line target yields to line-break clarity, not the other way around.

## Public API docs

Exported functions, classes, methods, and other library-boundary surfaces are exempt from the length cap. Include what a caller needs to use it without reading the implementation — parameters, return value, thrown/rejected errors, and a short usage example. Running past 3 lines here is expected, not a violation.

## What always gets a comment, public or private

Non-obvious side effects, invariants the type system can't express, workarounds for a specific bug or library quirk, ordering constraints, anything a careful reader could misread and break.

## What never gets a comment

Anything a rename would fix: restating the method name, narrating a straightforward loop (`// increment i`), echoing a type, describing what the next line obviously does.

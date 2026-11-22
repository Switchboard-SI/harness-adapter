name: Bug Report
description: File a bug report to help us improve the adapter
title: "[Bug] "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to file a bug report! Please fill out this form as completely as
        possible.
  - type: textarea
    attributes:
      label: What happened?
      description: |
        A clear and concise description of what the bug is. Include the Paperclip run payload, the
        HarnessRouter harness involved, and any error messages you saw.
      placeholder: Tell us what you saw...
      value: |
        I was trying to...
        Expected: ...
        Actual: ...
    validations:
      required: true
  - type: input
    attributes:
      label: Adapter version
      description: |
        What version of `@switchboard/harness-adapter` are you using?
      placeholder: "0.1.0"
    validations:
      required: true
  - type: input
    attributes:
      label: HarnessRouter version
      description: |
        What version of HarnessRouter CE are you running?
      placeholder: "0.40.2"
    validations:
      required: true
  - type: input
    attributes:
      label: Harness
      description: |
        Which harness were you targeting? (Claude Code, Codex, Hermes, Aider, OpenHands…)
      placeholder: "codex"
    validations:
      required: false
  - type: textarea
    attributes:
      label: Configuration (sanitized)
      description: |
        Your adapter configuration with any API keys removed.
      placeholder: |
        {
          "baseUrl": "http://127.0.0.1:3200/api/harness",
          "harnessId": "codex",
          "timeoutSeconds": 900
        }
    validations:
      required: false
  - type: textarea
    attributes:
      label: Steps to reproduce
      description: |
        Steps to reproduce the behavior, if applicable.
      placeholder: |
        1. Configure adapter with...
        2. Submit a Paperclip run with...
        3. Observe...
    validations:
      required: false
  - type: checkboxes
    attributes:
      label: I have checked that this issue is not already reported
      options:
        - label: I have searched existing issues
          required: true

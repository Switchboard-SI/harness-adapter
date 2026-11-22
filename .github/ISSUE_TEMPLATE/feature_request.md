name: Feature Request
description: Suggest an idea for this project
title: "[Feature] "
labels: ["enhancement", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Have a feature idea? We'd love to hear it. Please keep the request focused and explain the
        use case.
  - type: textarea
    attributes:
      label: Is your feature request related to a problem?
      description: |
        A clear and concise description of what the problem is. Ex. "I'm always frustrated when..."
      placeholder: Describe the problem...
    validations:
      required: false
  - type: textarea
    attributes:
      label: Describe the solution you'd like
      description: |
        A clear and concise description of what you want to happen.
      placeholder: Describe the desired behavior...
    validations:
      required: false
  - type: textarea
    attributes:
      label: Describe alternatives you've considered
      description: |
        A clear and concise description of any alternative solutions or features you've considered.
      placeholder: Describe alternatives...
    validations:
      required: false
  - type: textarea
    attributes:
      label: Additional context
      description: |
        Add any other context or screenshots about the feature request here.
      placeholder: Additional context...
    validations:
      required: false

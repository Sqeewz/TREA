# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "Create an account" [level=2] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]: Name
          - textbox "Name" [ref=e10]:
            - /placeholder: Full Name
            - text: Test User 1768882778291
        - generic [ref=e11]:
          - generic [ref=e12]: Email address
          - textbox "Email address" [ref=e13]: testuser_1768882778291@example.com
        - generic [ref=e14]:
          - generic [ref=e15]: Password
          - textbox "Password" [ref=e16]: password123
      - button "Registering..." [disabled] [ref=e18]
      - link "Already have an account? Sign in" [ref=e20] [cursor=pointer]:
        - /url: /login
  - contentinfo [ref=e21]:
    - paragraph [ref=e22]: 67162110146-1
  - button "Open Next.js Dev Tools" [ref=e28] [cursor=pointer]:
    - generic [ref=e31]:
      - text: Rendering
      - generic [ref=e32]:
        - generic [ref=e33]: .
        - generic [ref=e34]: .
        - generic [ref=e35]: .
  - alert [ref=e36]
```
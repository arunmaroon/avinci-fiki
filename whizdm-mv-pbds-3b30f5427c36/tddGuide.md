## TDD:
 - Getting started with TDD guide : https://whizdm.atlassian.net/wiki/spaces/WTD/pages/3223716026/TDD+Test+Driven+Development+in+PWA+and+other+web+applications

**Run Tests**
### Plese run this command to check the coverage along with results 
```JavaScript 

    bit test --coverage
```



### TDD best practices 
**Test your components in isolation:** 
    - Avoid testing the implementation details of child components. Instead, use mock functions or test doubles to replace them.

**Test a component's rendered output, not its internal state:** 
    - Focus on testing the component's output and behavior, not its internal state or implementation details.

**Write tests that mimic real user interactions:** 
    - Test your components as a user would interact with them, such as clicking buttons, typing in input fields, and selecting options from dropdowns.
    
Feature: End-to-end checkout on tutorialsninja demo store
  As a registered customer
  I want to log in, add multiple products to my cart and check out
  So that I can verify the order total is correct and the order appears in my order history

  Scenario: Log in, add multiple products, validate cart total and complete checkout
    Given the user logs in with valid credentials
    When the user searches for and adds the following products to the cart:
      | HP LP3065 |
    Then the sum of the selected product prices should match the cart total
    When the user completes the checkout process
    Then the order confirmation should be displayed
    And the placed order should appear in the order history

# Monna RPC

## Sending and wait
```json
{
    "id": "01abc0xFFFF",
    "name": "Auth.Login",
    "params": ["a1", "a2", {"number": 123}],
    "type": "MonnaRPC"
}
```


## Sending no wait
```json
{
    "id": "01abc0xFFFF",
    "name": "Auth.Login",
    "params": ["a1", "a2", {"number": 123}],
    "noreturn": true,
    "type": "MonnaRPC"
}
```


## Responding ok
```json
{
    "id": "01abc0xFFFF",
    "result": "Hello, world",
    "type": "MonnaRPC"
}
```


## Responding error
```json
{
    "id": "01abc0xFFFF",
    "error": "Can't find that item",
    "type": "MonnaRPC"
}
```
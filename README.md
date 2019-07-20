# warsawjs-workshop-34-trainer-needed

## 1. Serwer http z plikami statycznymi

Do rozpoczęcia pracy potrzebny jest serwer obsługujący protokuł http. 
Dodać prosty serwer serwujący pliku statyczne z folderu `public`.

* Hello world serwera http (`/src/index.ts`)

  * Utworzyć serwer przy wykorzystaniu funkcji `createServer` ze wbudowanego modułu `http` 

    * Zapisać do stałej `server`
      
    * Przekazać handler serwera w postaci funkcji `(request, response) => {...}`

      * Dodać blok `try catch`, który obejmie cały kod handlera
        
        * w przypadku błędu wyświetlić błąd do konsoli
        
        * wysłać odpowiedź w postać `e.toString()` gdzie `e` to wyłapany błąd przez `catch`
      
      * Handler serwera w odpowiedzi na wszystkie zapytania zwraca tekst `Test server` 
      
        * Wykorzystać metodę `end` obiektu `response`

  * Dodać nasłuchiwanie wykorzystując metodę `listen` obiektu `server`
    
    * Przekazać jako pierwszy argument stałą `PORT`
    
    * Jako drugi funkcję, która wywoła się po uruchomieniu serwera
    
      * Użyć `console.log` aby sprawdzić czy serwer rozpoczął nasłuchiwanie na porcie

* Modyfikacja handlera serwera, tak aby zwracał pliki statyczne 

  * Zapisać do stałej `url` adres URL z obiektu zapytania wykorzystując `request.url` 
  
    * W przypadku gdy adres jest równy `/` ustawić wartość `index.html`
    
      * Wykorzystać operator `? :`
      
  * Utworznie stałej `urlParts` z wartością `url.split('.')`

  * Utworznie stałej `fileExtension` z wartością ostatniego elementu tablicy `urlParts`
  
  * Utworznie stałej `contentType` z wartością z mapy `FILE_EXTENSION_TO_CONTENT_TYPE`, której kluczami są rozszerzenia plików

  * Ustawić status odpowiedzi wykorzystując metodę `writeHead` obiektu odpowiedzi (drugi argument handlera, zazwyczaj nazywany `res`) 

    * Jako pierwszy argument przekazać status odpowiedzi równy `200` 

    * Jako drugi argument przekazać obiekt `{ 'Content-Type': contentType }`

  * Wczytanie pliku 

    * Wykorzystać funckje `readFileSync` ze wbudowanego modułu `fs`  
      
      * Zapisać do stałej `file`

      * Jako pierwszy argument przekazać absolutną ścieżkę do pliku 

        * Do pobrania ścieżki projektu możesz skorzystać z `proces.cwd()` 

  * Wykorzystując metodę `response.end` zakończyć zapytanie przekazując do metody zawartość wczytanego pliku  
  
## 2. Dodanie WebSocketów 

Ustanowić stałe połaączenie pomiędzy klientem a serwerem wykorzystując WebSockety

### Serwer: (`/src/index.ts`) 

* Utworzyć nową instancję serwera `new WebSocket.Server` o nazwie `webSocketsServer` 

  * Przekazać do konstruktora obiekt konfiguracyjny z kluczem `server`, wskazujący na referencje do serwera HTTP 

* Dodać do serwera WebSockets nasłuchiwanie na `event` połączenia o nazwie `connection` przy wykorzystaniu metody `on` 

  * Klasa `Server` z pakietu `ws` dziedziczy do klasie `EventEmmiter` 

  * Handler eventu `connection` jako argument wywołania dostaje socket, który reprezentuje połączenie z klientem 

    * Wypisać do konsoli `socket connected`
    
    * Odesłać wiadomość powitalną o treści `welcome` wykorzystując `socket.send` 

* Dodać do `webSocketsServer` nasłuchiwanie na event `message` przy wykorzystaniu metody `on` 

  * Wypisać do konsoli dane eventu dostępne w argumencie handlera 

* Dodać do `webSocketsServer` nasłuchiwanie na event `close` przy wykorzystaniu metody `on` 

  * Wypisać do konsoli `socket closed`


### Klient: (`/public/client.js`) 

* W handlerze eventu `DOMContentLoaded` stworzyć nowe polaczeniem do serwera `WebSockets` 

  * Utworzyć instancję socketa wykorzystując klasę `WebSockets` o nazwie `socket` 

    * Konstruktor przyjmuje argument typu `string`, który reprezentuje adres serwera WebSockets `ws://localhost:5000`

  * Zaimplementować obsługę eventów: 

    * `onopen` - wywoływany po ustanowieniu połączenia z serwerem 

      * W reakcji na event: `console.log(['WebSocket.onopen'], event);`

    * `onmessage` - wywoływany przy każdej wiadomości serwera 

      * W reakcji na event: `console.log(['WebSocket.onmessage'], event);`  

    * `onerror` - wywoływany przy każdym błędzie komunikacji z serwerem 

      * W reakcji na event: `console.log(['WebSocket.onerror'], event);`  

    * `onclose` - wywoływany w sytuacji kiedy serwer zakończy połączenie z socketem 

      * W reakcji na event: `console.log(['WebSocket.onclose'], event);`  

## 3. Autentykacja użytkownika 

### Klient: 

* Dodać funckję do wysyłanie eventów:

```javascript
const sendEvent = (action, payload) => {
  try {
    socket.send(JSON.stringify({ action, payload }));
  }

  catch (e) {
    console.error(e);
  }
};
```

* Na ekranie powitalnym (funckja `renderLandingView`)
  
  * WAŻNE: `renderTemplateById` musi być zawsze wywołane w pierwszej kolejności, inaczej elementy ekranu nie będą wyrenderowane, nie będzie można z nimi nic zrobić

  * Dodać nasłuchiwanie na kliknięcie w element z `id="loginParticipant"` wykorzystując `addEventListener` oraz `getNodeById`
  
    * Przekazać nową funkcję jako handler funckję `renderParticipantLoginView`
  
  * Analogicznie zrobić dla elementu z `id="trainerParticipant"` 

* Ekran logowania uczestnika (funkcja `renderParticipantLoginView`)

  * Dodać nasłuchiwanie na event `submit` na elemencie formularza z `id="participantLoginForm"` 
  
    * Zablokować domyślne działanie zdarzenia poprzez `event.preventDefault();`
    
    * Wykorzystać `FormData` do zebrania danych z formulurza 
    
      * `const formData = new FormData(event.target);` 
      
      * Dostęp do danych `formData.get(group)` gdzie `group` do wartość atrybutu `name` elementu input formularza 
      
      * Nazwy pól w formularzu: 
        
        * `name` 
        
        * `group` 
        
    * Wykorzystać funkcję `sendEvent` do wysłania eventu do serwera WebSocket, przekazać obiekt z kluczami: 
    
      * `action` o wartości `PARTICIPANT_LOGIN` 
      
      * `payload` o wartości danych z formularza w postaci obiektu, gdzie nazwy pól to klucze
      

* Ekran logowania trenera 

  * Wykonać analogicznie dla ekranu logowania uczestnika

### Serwer 

* Dodać obiekt na poziomie pliku, który będzie reprezentował stan serwera

  * Obiekt zawiera dwie kolekcje, symulujące kanały
```javascript
const state: State = {
  participants: [],
  trainers: [],
};
```

* Obiekt reprezentujący podłączonego użytkownika 

  * `type` - `PARTICIPANT` lub `TRAINER` 
  
  * `data` - dane zebrane podczas logowania 
  
  * `socket` - referencja do socketa użytkownika 
  
* Na poziomie pliku dodać funckję wysyłające event dbającą o obsługę błędu

```javascript
const sendEvent = (socket: WebSocket, event: Event): void => {
  try {
    socket.send(JSON.stringify(event));
  }

  catch (e) {
    console.error(e);
  }
};
```
  
* Po połączeniu (event `connection`) stworzyć w domknięciu stałą reprezentującą połączonego użytkownika

```javascript
const connectedUser: User = {
  id: `user-id-${Date.now()}`,
  data: {
    name: '',
    group: '',
  },
  socket,
};
```

* W evencie `message`:

  * Sparsować argument eventu zrzutowany do `string` (`.toString()`) wykorzystując `JSON.parse` 
  
    * Zapisać do stałych pola obiektu `action` oraz `payload` 

  * Dodać prosty system akcji przy wykorzystaniu instrukcji warunkowej `switch`
  
    * Wykorzystać `action` w instrukcji `switch` 
    
      ```javascript
      switch (action as Action) {
        case 'PARTICIPANT_LOGIN': {
        ...
          break;
        }
        case 'TRAINER_LOGIN': {
        ...
          break;
        }
        default: {
          console.error('unknown action');
        }
      }
      ```
      
      * Dodać obsługę akcji `PARTICIPANT_LOGIN` 
      
        * Zaktualizować dane połączonego użytkownika `connectedUser.data` zawartością `payload` 
        
        * Dodać połączonego użytkownika do kanału uczestników `state.participants`
        
        * Wysłać akcję `PARTICIPANT_LOGGED` z pustym `payload` 
        
      * Dodać obsługę akcji `TRAINER_LOGIN` 
        
        * Zaktualizować dane połączonego użytkownika `connectedUser.data` zawartością `payload` 
                
        * Dodać połączonego użytkownika do kanału uczestników `state.trainers`
        
        * Wysłać akcję `TRAINER_LOGGED` z pustym `payload` 

## 4. Wysyłanie sygnału pomocy 

### Klient: 

* W evencie `onmessage` dodać prosty system nasłuchiwania na akcje, analogiczny do tego z serwera

```javascript
switch (action) {
      case 'PARTICIPANT_LOGGED': {
        break;
      }
    }
```

* Dodać obługę akcji `PARTICIPANT_LOGGED`

  * Wywołać funckję `renderIssueSubmitView`
  
* Dodać obsługę akcji `ISSUE_RECEIVED`

  * Wywołać funckję `renderIssueReceivedView`
  
* Na ekranie zgłaszania sygnału pomocy
  
  * Dodać obsługę eventu `submit` formularza o `id="issueSubmitForm"`
  
    * Po kliknięciu wysłać event z `action` o wartości  `TRAINER_NEEDED` i `payload` z wartością inputa `problem`
     

### Serwer: 

* Dodać kolekcje reprezentującą zgłoszenia uczestników do stanu serwera pod kluczem `issues` w postaci: 
  
  * `id` - unikalny identyfikator  
  
  * `status` - statnus zgłoszenia
  
  * `userId` - identyfikator uczestnika 
  
  * `userName` - nazwa uczestnika
  
  * `userGroup` - grupa uczestnika
   
  * `problem` - opis problemu  

* Dodać obsługę akcji `TRAINER_NEEDED` 
  
  * W odpowiedzi na event dodać nowy element do kolekcji zgłoszeń  
  
  * Wysłać do użytkownika event z akcją `ISSUE_RECEIVED` i pustym `payload`

## 5. Wyświetlanie zgłoszeń  

### Serwer 

* Wysyłanie listy zgłoszeń  

  * Do akcji `TRAINER_LOGGED` dodać `payload` z kolekcją zgłoszeń
  
  * Po wystąpieniu akcji `TRAINER_NEEDED` wysłać do wszystkich trenerów akcji `ISSUES` z `payload` jako wszystkie zgłoszenia

### Klient: 
    
* Dodać obsługę akcji `ISSUES`

  * wywołać funkcję `renderTrainerDashboardView` i przekazać jej `payload`

* Dodać obsługę akcji `TRAINER_LOGGED`

  * wywołać funkcję `renderTrainerDashboardView` i przekazać jej `payload`
  
* Dodać referencję do elementów o `issueListItem` i `issueList`

  ```javascript
  const issueListItemTemplate = getNodeById('issueListItem');
  const issueListNode = getNodeById('issueList');
  ```
* Przeiterować się z użyciem `forEach` po argumecie `data`, który jest tablicą zgłoszeń w postaci wysłanej przez serwer

  ```javascript
  data.forEach(it => {
    ...
  });
  ```
  * Podczas każdej iteracji tworzyć nowy element na podstawie szablonu `issueListItemTemplate`
   
    `const issueListItemNode = document.importNode(issueListItemTemplate.content, true);`
    
  * W stworzonym elemencie ustawić zawartość tekstu, nadpisująć zawartość pola `textContent` elementu
  
    * `issueListItemNode.querySelector('.issueListItemName').textContent = it.userName;`
      
      * Element posiada klasy, dzięki którym można zidentyfikować element do wyświetlenia danach:
      
        * `.issueListItemName` - kolumna z nazwą uczestnika
        
        * `.issueListItemGroup` - kolumna z grupą uczestnika
        
        * `.issueListItemProblem` - kolumna z problemem uczestnika
        
        * `.issueListItemStatus` - kolumna ze statusem zgłoszenia
        
    * Dodać do parenta
    
      * `issueListNode.appendChild(issueListItemNode);`

## 6. Przyjęcie zgłoszenia

Dodać obsługę przyjęcia zgłoszenia przez trenera.

### Klient: 

* Na ekranie listy zgłoszeń, podczas iteracji po zgłoszenia

  * Dodać referenję do przycisku `Przyjmij zgłoszenie`
  
    * `const takeIssueButtonNode = issueListItemNode.querySelector('.issueListItemActions button');`
  
  * Dodać `switch` pracujący na statusie zgłoszenia `it.status` po `issueListNode.appendChild(issueListItemNode);`
    
    * Dla statusu `PENDING`:
    
      * Dodać nasłuchiwanie na kliknięcie na elemencie `takeIssueButtonNode`
      
        * W odpowiedzi na kliknięcie wysłać event z akcją `ISSUE_TAKEN` z identyfikatorem zgłoszenia `it.id` jako `payload`
        
    * dla `default`:
    
      * do elementu `takeIssueButtonNode` dodać klasę `hide` wykorzystując `.classList.add('hide')`
      

### Serwer: 

* Dodać obsługę akcji `ISSUE_TAKEN`

  * Znaleźć w kolekcji zgłoszenie wykorzystując `payload` zawierający identyfikator zgłoszenia i zapisać do stałej `issue`
  
    * Jeśli się nie udało przerwać `switch`
  
      * `if (!issue) break;`
      
  * Zmienić status zgłoszenia na `TAKEN`
  
    * Zauktualizować wartość przez referencję

  * Wysłać akcje `ISSUES` do wszystkich trenerów z nową listą zgłoszeń

## 7. Problem rozwiązany  

### Klient: 

* Dodać obsługę akcji `ISSUE_RECEIVED` 

  * Zawartość `payload` ustawić jako wartość pola `issueId` 

* Dodać na ekranie zgłoszenia przycisk `Problem rozwiązany`  

  * Po kliknięciu wysłać event z akcją `ISSUE_SOLVED` z `payload` z wartością `issueId`  

  * Zmienić na ekran zgłaszania problemu  

### Serwer: 

* W akcji `ISSUE_TAKEN`

  * Znaleźć w uczestnika wykorzystując obiekt zgłoszenia zawierający identyfikator uczestnika `issue.userId` i zapisać do stałej `partcipant`
  
    * Jeśli się nie udało przerwać `switch`
  
      * `if (!participant) break;`
      
  * Wysłać do uczestnika akcję `ISSUE_TAKEN`
    
    * Jako `payload` ustawić nazwę trenera dostępną w `connectedUser.data.name`

* Po przyjęciu zgłoszenia odesłać akcje `ISSUE_RECEIVED` z `payload` z wartością identyfikatora utworzonego zgłoszenia 

  * Dodać obsługę akcji `ISSUE_SOLVED` 
  
  * Wykorzystać identyfikator  z `payload` do odnalezienia zgłoszenia i aktualizacji statusu zgłoszenia na `SOLVED` 


## 8. Pomoc przez wiadomość  

### Klient: 

* Dodać do stanu globalnego pole `hint` o wartości inicjalnej `null` 

* Dodać obsługę akcji `HINT`  

  * Ustawić wartość `payload` wartości pola `hint` w stanie globalnym  

* Na ekranie zgłoszenia jeśli `hint` nie jest puste wyświetlić: 

  * Wiadomość od trenera  
  
  * Przyciski: 
  
    * `Pomogło` 
      
      * Po kliknięciu wysyłać akcje `ISSUE_SOLVED` 
      
      * Wyświetlić ekran zgłaszania problemu 
      
      * Ustawić wartość pola `hint` na `null` 
      
    * `Nie pomogło` 
    
      * Po kliknięciu wysłać akcję `HINT_FAIL` z `payload` z wartością `issueId` 
      
      * Ustawić wartość pola `hint` na `null` 

* Rozszerzyć strukturę reprezentującą zgłoszeniu na liście o pole `hint` 

* Na ekranie listy zgłoszeń dodać szósta kolumnę z `textarea` na opis rozwiązania problemu oraz przycisk `wyślij` 

  * Po kliknięciu wysłać event z akcją `HINT` z `payload` z wartością `textarea` 

Serwer: 

* Dodać obsługę akcji `HINT` 

* Dodać obsługę akcji `HINT_FAIL` 


## Wyzwania

 * Dodać walidację czy użytkownik o danej nazwie już istnieje
 
 * Wyświetlić listę uczestnik na ekranie zgłoszeń trenera
 
 * Dodać więcej danych do tabeli zgłoszeń:
 
  * Data zgłoszenia i data ostatniej modyfikacji
  
  * Nazwa trenera, który przyjął zgłoszenie
  
  * Dodać ekran `Moje zgłoszenia`, który by wyświetlał się po zalogowaniu uczestnika i po rozwiązaniu problemu
  
    * Na ekranie przycisk `Nowe zgłoszenie` do przejścia na ekran zgłaszania pomocy
    
  * Dodać obsługę ponownego połączenia użytkownika
   

 

 

 

 

 

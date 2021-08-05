# Class: Fetchy

### The *Fetchy* class represent an handy and configurable helper that allows to easily interact with remote resources.

Any instance can be configured in many different aspects while enforcing use of correct configuration. <br>
Leveraging its functionalities it's easy to generate pre-configured instances of any given remote resource, and easily query them with cool features like: automatic error handling, caching, timeouts, etc.

### Example:
```
//Define and configure a new instance of a Fetchy Class
const Authors = new Fetchy("/api/v1/authors")
     .method('POST')
     .cache(true)
     .id('articles')
     .expiry(1);

//Further edit the configuration and fire the request.
Authors
     .data({
            parameter1: 'value1',
            parameter2: 'value2'
     })
     .then((results) => {
        console.log(results);
     });

//Execute another call with different parameters (caching won't affect the results since the payload has changed)
Authors
     .data({
            parameter4: 123,
            parameter6: false
     })
     .then((results) => {
        console.log(results);
     })
     .catch((error) => {
        console.log(error);
     });
```

**`param`** This parameter is required

**`returns`** a new instance of Fetchy class

## Table of contents

### Constructors

- [constructor](Fetchy.md#constructor)

### Internal Properties

- [writable](Fetchy.md#writable)

### Other Properties

- [cacheQueueRetries](Fetchy.md#cachequeueretries)
- [cacheQueueUID](Fetchy.md#cachequeueuid)
- [cacheStorage](Fetchy.md#cachestorage)
- [cacheUID](Fetchy.md#cacheuid)
- [config](Fetchy.md#config)

### Methods

- [attachSelf](Fetchy.md#attachself)
- [cache](Fetchy.md#cache)
- [call](Fetchy.md#call)
- [catch](Fetchy.md#catch)
- [clearCache](Fetchy.md#clearcache)
- [clone](Fetchy.md#clone)
- [credentials](Fetchy.md#credentials)
- [data](Fetchy.md#data)
- [do](Fetchy.md#do)
- [expiry](Fetchy.md#expiry)
- [finally](Fetchy.md#finally)
- [format](Fetchy.md#format)
- [formatResponse](Fetchy.md#formatresponse)
- [getCacheHash](Fetchy.md#getcachehash)
- [headers](Fetchy.md#headers)
- [id](Fetchy.md#id)
- [isCached](Fetchy.md#iscached)
- [isInQueue](Fetchy.md#isinqueue)
- [method](Fetchy.md#method)
- [mode](Fetchy.md#mode)
- [override](Fetchy.md#override)
- [refreshCacheStorage](Fetchy.md#refreshcachestorage)
- [retrieveCached](Fetchy.md#retrievecached)
- [retry](Fetchy.md#retry)
- [setQueue](Fetchy.md#setqueue)
- [storeCached](Fetchy.md#storecached)
- [then](Fetchy.md#then)
- [timeout](Fetchy.md#timeout)
- [validator](Fetchy.md#validator)

## Constructors

### constructor

• **new Fetchy**(`url`)

### Basic usage (GET):

```
const Resource = new Fetchy("/api/v1/:endpoint");
Resource.then((data) => {
    //...
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Defined in

[fetchy.ts:184](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L184)

## Internal Properties

### writable

• `Private` **writable**: `boolean` = `true`

The properties of a Fetchy instance are mutable up until the first fetch. <br>
From that moment only the payload data can be mutated, in order to prevent consistency issues.

#### Defined in

[fetchy.ts:172](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L172)

___

## Other Properties

### cacheQueueRetries

• `Private` `Readonly` **cacheQueueRetries**: ``40``

Internal use only.

**`internal`**

#### Defined in

[fetchy.ts:157](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L157)

___

### cacheQueueUID

• `Private` `Readonly` **cacheQueueUID**: ``"_cacheResponseQueue"``

Internal use only.

**`internal`**

#### Defined in

[fetchy.ts:152](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L152)

___

### cacheStorage

• `Private` **cacheStorage**: `Object` = `{}`

This variable handles the internal caching storage.

**`internal`**

#### Defined in

[fetchy.ts:164](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L164)

___

### cacheUID

• `Private` `Readonly` **cacheUID**: ``"_cacheResponseData"``

Internal use only.

**`internal`**

#### Defined in

[fetchy.ts:147](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L147)

___

### config

• `Private` **config**: `FetchyConfig`

This variable represents the internal state of a Fetchy instance. <br>
It mutates while you configure your instance, and it's inherited from its child.

**`internal`**

#### Defined in

[fetchy.ts:135](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L135)

## Methods

### attachSelf

▸ `Private` **attachSelf**(`response`): `any`

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `any` |

#### Returns

`any`

#### Defined in

[fetchy.ts:219](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L219)

___

### cache

▸ **cache**(`enable`): [`Fetchy`](Fetchy.md)

Enable or disable automatic caching for the current Fetchy instance. <br>
Caching is performed automatically when enabled based on the current set of parameters, and automatically handling configuration changes. <br>
Any change in the configuration or data payload will generate new calls instead of fetching from the cache.

**`cache`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `enable` | `boolean` | true \| false |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:580](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L580)

___

### call

▸ `Private` **call**(): `Promise`<`Response`\>

**`internal`**

#### Returns

`Promise`<`Response`\>

#### Defined in

[fetchy.ts:304](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L304)

___

### catch

▸ **catch**(`fn`): `any`

Triggers the data fetch and returns the final payload. <br>
After this method is invoked is no longer possible to change this instance configuration without cloning it.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `Function` | A callback function that is invoked with the result of the fetch in case of error |

#### Returns

`any`

*a mutated version* of Fetchy class instance that inherits all the properties of a *Promise*.

#### Defined in

[fetchy.ts:765](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L765)

___

### clearCache

▸ **clearCache**(`id?`): `void`

Allows to clear the cached entries of a specific id or in general.

**`cache`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id?` | `string` | The id of the cached entity. *optional |

#### Returns

`void`

#### Defined in

[fetchy.ts:612](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L612)

___

### clone

▸ **clone**(): [`Fetchy`](Fetchy.md)

Clones the current instance into a new one, allowing for configuration changes without affecting the original instance.

**`utility`**

#### Returns

[`Fetchy`](Fetchy.md)

*a new clone* of Fetchy class instance that inherits all previous configurations.

#### Defined in

[fetchy.ts:547](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L547)

___

### credentials

▸ **credentials**(`credentials`): [`Fetchy`](Fetchy.md)

Sets the credential mode for the current Fetch instance.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `credentials` | `string` | Allowed values: 'omit', 'same-origin', 'include' |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:482](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L482)

___

### data

▸ **data**(`data`): [`Fetchy`](Fetchy.md)

Allows to set request payload.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | Allowed formats: Object, Array, String. |

#### Returns

[`Fetchy`](Fetchy.md)

*a new clone* of Fetchy class instance that inherits all previous configurations.

#### Defined in

[fetchy.ts:445](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L445)

___

### do

▸ `Private` **do**(): `any`

**`internal`**

#### Returns

`any`

#### Defined in

[fetchy.ts:228](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L228)

___

### expiry

▸ **expiry**(`minutes`): [`Fetchy`](Fetchy.md)

Sets a time in minutes after which any cached request will be discarded and substituted with a fresh data fetch.

**`cache`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `minutes` | `number` | Timing expressed in minutes |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:594](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L594)

___

### finally

▸ **finally**(`fn`): `any`

Triggers the data fetch and returns the final payload. <br>
After this method is invoked is no longer possible to change this instance configuration without cloning it.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `Function` | A callback function that is invoked with the result of the fetch in either case |

#### Returns

`any`

*a mutated version* of Fetchy class instance that inherits all the properties of a *Promise*.

#### Defined in

[fetchy.ts:777](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L777)

___

### format

▸ **format**(`format`): [`Fetchy`](Fetchy.md)

Allows to set fetch expected response format

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `format` | `string` | Allowed values: 'json', 'text', 'blob' |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:406](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L406)

___

### formatResponse

▸ `Private` **formatResponse**(`metaResponse`): `any`

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `metaResponse` | `any` |

#### Returns

`any`

#### Defined in

[fetchy.ts:321](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L321)

___

### getCacheHash

▸ `Private` **getCacheHash**(): `string`

**`internal`**

#### Returns

`string`

#### Defined in

[fetchy.ts:707](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L707)

___

### headers

▸ **headers**(`headers`): [`Fetchy`](Fetchy.md)

Allows to set headers for the fetch call.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headers` | `any` | Allowed values Array, Object |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:372](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L372)

___

### id

▸ **id**(`id`): [`Fetchy`](Fetchy.md)

Sets a unique id for the current Fetch instance, allowing more clear and debug friendly caching

**`cache`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Allowed values: Any unique string |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:464](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L464)

___

### isCached

▸ `Private` **isCached**(): `boolean`

**`internal`**

#### Returns

`boolean`

#### Defined in

[fetchy.ts:636](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L636)

___

### isInQueue

▸ `Private` **isInQueue**(): `boolean`

**`internal`**

#### Returns

`boolean`

#### Defined in

[fetchy.ts:741](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L741)

___

### method

▸ **method**(`method`): [`Fetchy`](Fetchy.md)

Allows to set a method for the fetch call.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Allowed values: 'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS' |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:353](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L353)

___

### mode

▸ **mode**(`mode`): [`Fetchy`](Fetchy.md)

Sets a mode for the current Fetch instance to handle CORS issues

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | `string` | Allowed values: 'cors', 'same-origin', 'no-cors' |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:501](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L501)

___

### override

▸ **override**(`config`): [`Fetchy`](Fetchy.md)

Override the current configuration of the Fetchy instance without format restrictions, should not be used.

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `any` |

#### Returns

[`Fetchy`](Fetchy.md)

*a new clone* of Fetchy class instance that inherits all previous configurations.

#### Defined in

[fetchy.ts:560](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L560)

___

### refreshCacheStorage

▸ `Private` **refreshCacheStorage**(): `void`

**`internal`**

#### Returns

`void`

#### Defined in

[fetchy.ts:647](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L647)

___

### retrieveCached

▸ `Private` **retrieveCached**(): `Promise`<`unknown`\>

**`internal`**

#### Returns

`Promise`<`unknown`\>

#### Defined in

[fetchy.ts:656](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L656)

___

### retry

▸ **retry**(`times`, `delayMs?`): [`Fetchy`](Fetchy.md)

Allows to set automatic retries in case of fetch failure.

**`errorhandling`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `times` | `number` | `undefined` | Number of times to retry before considering failed the request |
| `delayMs` | `number` | `0` | Time to wait between each try, expressed in ms. |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:426](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L426)

___

### setQueue

▸ `Private` **setQueue**(): `void`

**`internal`**

#### Returns

`void`

#### Defined in

[fetchy.ts:733](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L733)

___

### storeCached

▸ `Private` **storeCached**(`response`): `void`

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `any` |

#### Returns

`void`

#### Defined in

[fetchy.ts:691](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L691)

___

### then

▸ **then**(`fn`): `any`

Triggers the data fetch and returns the final payload. <br>
After this method is invoked is no longer possible to change this instance configuration without cloning it.

**`request`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `Function` | A callback function that is invoked with the result of the fetch in case of success |

#### Returns

`any`

*a mutated version* of Fetchy class instance that inherits all the properties of a *Promise*.

#### Defined in

[fetchy.ts:753](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L753)

___

### timeout

▸ **timeout**(`seconds`): [`Fetchy`](Fetchy.md)

Allows to set fetch timeout in seconds.

**`errorhandling`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `seconds` | `number` | Must be a value equal or greater than 1 |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance

#### Defined in

[fetchy.ts:388](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L388)

___

### validator

▸ **validator**(`fn`): [`Fetchy`](Fetchy.md)

Sets a validator function to allow or forbid caching of any request coming from this instance. The cache is common among all Fetchy instances <br> Defaults to <b>Ensure that the response is not empty and with status code 200</b>.

**`cache`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `any` | Allowed values: 'cors', 'same-origin', 'no-cors' |

#### Returns

[`Fetchy`](Fetchy.md)

the Fetchy class instance
<br>
Example validator function:
```
   const Helper = new Fetchy("/api/v1/:endpoint")
     .cache(true) //Caching must be enabled for validator function to take any effect.
     .validator((response) => {
         return response && response.header.status === "OK";
     });
```

#### Defined in

[fetchy.ts:530](https://github.com/Mango-Design/Fetchy/blob/c7f0ebe/src/ts/fetchy.ts#L530)

import { Either, left, right } from "./either"
import { expect, test } from "vitest"

function doSomething(shouldSuccess: boolean): Either<string, number>{
if(shouldSuccess){
    return right(10)
}else{
    return left('error')
}
}

test('Success result', () =>{
   const result = doSomething(true)

 expect(result.isRight()).toEqual(true)
 expect(result.isLeft()).toEqual(false)

})


test('Error result', () =>{
    const result = doSomething(false)


 expect(result.isRight()).toEqual(false)
 expect(result.isLeft()).toEqual(true)
})
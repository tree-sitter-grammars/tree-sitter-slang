
void main() {
  int a;
  var a = 1; // OK, `a` is an `int`.
  var b = float3(0, 1, 2); // OK, `b` is a `float3`.
  var a : int = 1; // OK.
  var b : int; // OK.
  let a = 5; // OK, `a` is `int`.
  let b : int = 5; // OK.
}

interface IFoo
{
    int myMethod(float arg);
};

extension IFoo
{
    int bar() { return 0; }
};

int myGenericMethod<T: IFoo>(T arg)
{
      bool t = foo is MyImpl; // true
      Optional<MyImpl> optV = foo as MyImpl;
    return arg.myMethod(1.0);
}

extension MyObject : IBar, IBar2
{
    float bar() { return 1.0f; }
    float bar2() { return 2.0f; }
};

struct MyType
{
    int val[12];
    __subscript(int x, int y) -> int
    {
        get { return val[x*3 + y]; }
        set { val[x*3+y] = newValue; }
    }
};

struct MyType
{
    int myVal;
    __init()
    {
        myVal = 10;
    }
};

struct MyType
{
    uint flag;

    property highBits : uint
    {
        get { return flag >> 16; }
        set { flag = (flag & 0xFF) + (newValue << 16); }
    }
};

interface IFoo
{
    property int count {get; set;}
};

extension uint : IPrintf
{
    // A `uint` only consumes one word in the variadic payload.
    //
    // Note: unlike the case for `IPrintable` above, the encoding
    // for format args for `printf()` doesn't include type information.
    //
    uint getPrintfWordCount() { return 1; }

    // Writing the required data to the payload for `printf()` is simple
    void writePrintfWords(RWStructuredBuffer<uint> buffer, uint offset)
    {
        buffer[offset++] = this;
    }
};

extension String : IPrintf
{
    uint getPrintfWordCount() { return 1; }

    void writePrintfWords(RWStructuredBuffer<uint> buffer, uint offset)
    {
        buffer[offset++] = getStringHash(this);
    }
};


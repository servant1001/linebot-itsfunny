module.exports = {
	__initial: __initial,
};

function __initial() {
    var a = '123';
    function cc(){
        a='3210';
    }
    cc();
    return a;
}
const swap = (arr, a, b) => {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
};

module.exports.sort = (arr, pos) => {
    let l = 2 * pos + 1, r = 2 * pos + 2;
    let node = arr[pos];

    if (l < arr.length) {
        let left = arr[l];
        switch (true) {
            case node.points.w < left.points.w:
                swap(arr, pos, l);
                break;
            case node.points.r < left.points.r:
                swap(arr, pos, l);
                break;
            case node.points.a < left.points.a:
                swap(arr, pos, l);
                break;
            default:
                console.log('i do not know how you got here');
        }
        this.sort(arr, l);
    }

    if (r < arr.length) {
        let right = arr[r];
        switch (true) {
            case node.points.w < right.points.w:
                swap(arr, pos, r);
                break;
            case node.points.r < right.points.r:
                swap(arr, pos, r);
                break;
            case node.points.a < right.points.a:
                swap(arr, pos, r);
                break;
            default:
                console.log('i do not know how you got here');
        }
        this.sort(arr, r);
    }
};

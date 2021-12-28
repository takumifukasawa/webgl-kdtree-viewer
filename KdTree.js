class Node {
    value = null;
    leftChild = null;
    rightChild = null;
    constructor(value) {
        this.value = value;
    }
}

export default class KdTree {
    #root;
    constructor(pointList, axes, medianFunc) {
        const iter = KdTree.iter(pointList, axes, medianFunc, 0);
        this.#root = iter;
    }
    static iter(list, axes, medianFunc, depth) {
        if(list.length < 1) {
            return null;
        }
        const axisIndex = depth % axes.length;
        const axis = axes[axisIndex];
        const [median, sortedList] = medianFunc(list, axis);
        const beforeList = sortedList.splice(
            0,
            sortedList.length % 2 == 0
                ? sortedList.length / 2
                : Math.floor(sortedList.length / 2)
        );
        const afterList = sortedList;
        const node = new Node(median);
        if(beforeList.length === 1) {
            node.leftChild = new Node(beforeList[0]);
        } else {
            node.leftChild = KdTree.iter(beforeList, axes, medianFunc, depth + 1);
        }
        if(afterList.length === 1) {
            node.rightChild = new Node(afterList[0]);
        } else {
            node.rightChild = KdTree.iter(afterList, axes, medianFunc, depth + 1);
        }
        return node;
    }
}
package avaliadordearquiteturaemcamadas;

public class Mapper<T1, T2> {
    
    public Mapper(T1 ob1, T2 ob2){
        this.obj1 = ob1;
        this.obj2 = ob2;
    }
    
    private T1 obj1;
    private T2 obj2;

    public T1 getObj1() {
        return obj1;
    }

    public T2 getObj2() {
        return obj2;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        
        if (!Mapper.class.isAssignableFrom(obj.getClass())) {
            return false;
        }
        
        final Mapper other = (Mapper) obj;
        if ((this.obj1 == null) ? (other.obj1 != null) : !this.obj1.equals(other.obj1)) {
            return false;
        }
        
        if ((this.obj2 == null) ? (other.obj2 != null) : !this.obj2.equals(other.obj2)) {
            return false;
        }
        
        return true;
    }
}

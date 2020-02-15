 
 public class Sudoku{
 
	public static boolean checkSubregion(int region, byte[][] grid){
      int startRow = (Math.floorDiv(region,3))*3;
	  int startCol = (region*3)%9;
	  int[] gridCheck = new int[9];
	  int count = 0;
	  for (int a = 0; a < 3;a++){
		  for (int b = 0; b <3;b++){
			  if (grid[startRow+a][startCol+b] > 9 || grid[startRow+a][startCol+b] < 1){
				  return false;
			  }	  
		      for (int f = 0; f < gridCheck.length;f++){
				if (grid[startRow+a][startCol+b] == gridCheck[f]){
					return false;
				}
			  }
			gridCheck[count] = grid[startRow+a][startCol+b];
		  }
	  }
	  
	  return true;
    }


    public static boolean check(byte[][] grid){
      // check the subregions
      for(int subregion=0; subregion<9; subregion+=1){  
        if( !checkSubregion(subregion, grid) ){
          return false;
        }
      }

      
  		// if we get this far then we conclude that the grid
  		// must be valid (because if it was not, we would have
  		// returned false somewhere above)
      return true;
    }
      


    public static void main(String[] args){

      System.out.print("exmample1 | expected output is true  | actual output is ");
      System.out.println(check(example1));

      System.out.print("exmample2 | expected output is false | actual output is ");
      System.out.println(check(example2));
	  
	  System.out.print("example3 | expeceted output is true | actual output is ");
	  System.out.println(check(example3));

	  System.out.print("example4  | expected output is true | actual output is ");
	  System.out.println(check(example4));
    }


      /** sample valid game */
    public static byte[][] example1 = new byte[][]{
      {5,3,4,6,7,8,9,1,2},
      {6,7,2,1,9,5,3,4,8},
      {1,9,8,3,4,2,5,6,7},
      {8,5,9,7,6,1,4,2,3},
      {4,2,6,8,5,3,7,9,1},
      {7,1,3,9,2,4,8,5,6},
      {9,6,1,5,3,7,2,8,4},
      {2,8,7,4,1,9,6,3,5},
      {3,4,5,2,8,6,1,7,9}};

    /** sample invalid game */
    public static byte[][] example2 = new byte[][]{
      {5,3,4,6,7,8,9,1,2},
      {6,7,2,1,9,5,3,4,8},
      {1,9,8,3,4,2,5,6,7},
      {8,5,9,7,6,1,4,2,3},
      {4,2,6,8,5,3,7,9,1},
      {7,1,3,9,2,4,8,5,6},
      {9,6,1,5,3,7,2,8,3},
      {2,8,7,4,1,9,6,2,6},
      {3,4,5,2,8,6,1,8,8}};

	public static byte[][] example3 = new byte[][]{
	  {7,3,5,6,1,4,8,9,2},
	  {8,4,2,9,7,3,5,6,1},
	  {9,6,1,2,8,5,3,7,4},
	  {2,8,6,3,4,9,1,5,7},
	  {4,1,3,8,5,7,9,2,6},
	  {5,7,9,1,2,6,4,3,8},
	  {1,5,7,4,9,2,6,8,3},
      {6,9,4,7,3,8,2,1,5},
	  {3,2,8,5,6,1,7,4,9}};
	
	public static byte[][] example4 = new byte[][]{
	{1,5,2,4,8,9,3,7,6},
	{7,3,9,2,5,6,8,4,1},
	{4,6,8,3,7,1,2,9,5},
	{3,8,7,1,2,4,6,5,9},
	{5,9,1,7,6,3,4,2,8},
	{2,4,6,8,9,5,7,1,3},
	{9,1,4,6,3,7,5,8,2},
	{6,2,5,9,4,8,1,3,7},
	{8,7,3,5,1,2,9,6,4}};
	  
  }